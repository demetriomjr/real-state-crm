# Real State CRM - WhatsApp Integration

A comprehensive Real Estate CRM system with WhatsApp integration using NestJS, N8N, and WAHA.

## 🎯 Project Goal

This project provides a complete Real Estate CRM solution with automated WhatsApp messaging capabilities. It enables real estate agents to manage leads, customers, and properties while maintaining seamless communication through WhatsApp integration.

## 🛠️ Technology Stack

- **Backend**: Node.js, NestJS, TypeScript, Prisma, PostgreSQL
- **HTTP Client**: Axios
- **Automation**: N8N, WAHA (WhatsApp HTTP API)
- **DevOps**: Docker, Docker Compose
- **Testing**: Jest
- **Documentation**: OpenAPI/Swagger

## 🐳 Services

| Service | Port | Purpose |
|---------|------|---------|
| **NestJS App** | 3000 | Main CRM application |
| **WAHA** | 3100 | WhatsApp HTTP API |
| **N8N** | 5678 | Workflow automation |
| **PostgreSQL** | 5432 | Primary database |

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+

### 1. Setup
```bash
git clone <repository-url>
cd real-state-crm/server
cp env.temp .env
```

### 2. Start Services
```bash
docker-compose up -d
npm run prisma:migrate
npm run prisma:generate
```

### 3. WhatsApp Authentication
1. Access WAHA Dashboard: http://localhost:3100
2. Create session "default"
3. Scan QR code with WhatsApp mobile app

### 4. N8N Workflow
1. Access N8N: http://localhost:5678 (admin/admin123)
2. Import workflow: `resources/waha-n8n-flow.json`
3. Activate workflow

## 🧪 Testing

```bash
# All tests
npm run test
npm run test:e2e

# Specific tests
npm run test -- whatsapp.integration.spec.ts
```

## 📋 Features

### Core CRM
- User Management (multi-level)
- Business Management (multi-tenant)
- Lead & Customer Management
- Chat System
- Feedback System

### WhatsApp Integration
- Message Reception & Sending
- Session Management
- QR Code Authentication
- Webhook Processing

### Automation
- N8N Workflows
- Webhook Integration
- Error Handling & Logging

## 📚 Documentation

- **API Documentation**: http://localhost:3000/api
- **WAHA Dashboard**: http://localhost:3100
- **N8N Interface**: http://localhost:5678

## 🔍 Monitoring

```bash
# View logs
docker-compose logs app
docker-compose logs waha
docker-compose logs n8n

# Health checks
curl http://localhost:3000/health
curl http://localhost:3100/api/sessions
```

## 🚨 Troubleshooting

### Common Issues
- **WAHA**: Check WhatsApp Web connection, verify session status
- **N8N**: Ensure workflow is active, check webhook URLs
- **Database**: Verify DATABASE_URL, run migrations
- **App**: Check environment variables, container health

## 📄 License

MIT License