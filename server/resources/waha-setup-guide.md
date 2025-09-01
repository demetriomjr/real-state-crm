# WAHA Authentication & Setup Guide

## 🚀 Quick Start

### 1. Access WAHA Dashboard
- **URL**: http://localhost:3100
- **Purpose**: Manage WhatsApp sessions and authentication

### 2. Create WhatsApp Session
1. Open WAHA Dashboard
2. Click "Add Instance" or "Create Session"
3. Enter session name: `default` (or your preferred name)
4. Click "Create"

### 3. Authenticate WhatsApp
1. **QR Code Method** (Recommended for testing):
   - Click "Get QR Code" 
   - Scan with your WhatsApp mobile app
   - Wait for connection confirmation

2. **Phone Number Method** (Alternative):
   - Click "Request Code"
   - Enter your phone number
   - Enter the 6-digit code received via SMS

### 4. Verify Connection
- Check session status shows "Connected"
- Test by sending a message to your number

## 🔧 API Endpoints

### Session Management
```bash
# List sessions
GET http://localhost:3100/api/sessions

# Get session status
GET http://localhost:3100/api/sessions/default

# Get QR code
GET http://localhost:3100/api/default/auth/qr

# Request SMS code
POST http://localhost:3100/api/default/auth/request-code
```

### Message Sending
```bash
# Send text message
POST http://localhost:3100/api/sendText
{
  "chatId": "1234567890@c.us",
  "text": "Hello from WAHA!"
}
```

## 🧪 Testing Commands

### Test WAHA Directly
```bash
# Test session status
curl -X GET http://localhost:3100/api/sessions

# Test sending message
curl -X POST http://localhost:3100/api/sendText \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "YOUR_PHONE@c.us",
    "text": "Test message from WAHA"
  }'
```

### Test N8N Integration
```bash
# Test inbound webhook
curl -X POST http://localhost:5678/webhook/waha-inbound \
  -H "Content-Type: application/json" \
  -d '{
    "message": {
      "id": "test123",
      "from": "1234567890@c.us",
      "type": "text",
      "text": {"body": "Test message"}
    }
  }'

# Test outbound webhook
curl -X POST http://localhost:5678/webhook/send-message \
  -H "Content-Type: application/json" \
  -d '{
    "chatId": "1234567890@c.us",
    "text": "Test message via N8N"
  }'
```

## 🔍 Troubleshooting

### Common Issues
1. **QR Code not working**: Try refreshing the page and getting a new QR code
2. **Session disconnected**: Check if WhatsApp Web is connected on your phone
3. **Messages not sending**: Verify session is "Connected" status
4. **Webhook errors**: Check N8N flow is active and endpoints are correct

### Logs
```bash
# Check WAHA logs
docker-compose logs waha

# Check N8N logs
docker-compose logs n8n

# Check app logs
docker-compose logs app
```

## 📋 Production Setup

### Environment Variables
```env
WAHA_URL=http://waha:3000
WHATSAPP_WEBHOOK_SECRET=your-secure-secret
```

### Session Management
- Use persistent session names
- Implement session recovery logic
- Monitor session health
- Set up automatic reconnection

## 🎯 Next Steps
1. Import N8N flow from `resources/waha-n8n-flow.json`
2. Test complete integration flow
3. Set up monitoring and logging
4. Implement error handling and retry logic
