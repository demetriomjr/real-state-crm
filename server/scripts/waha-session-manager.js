const axios = require('axios');

const WAHA_BASE_URL = 'http://localhost:3100/api';

class WahaSessionManager {
  constructor() {
    this.baseURL = WAHA_BASE_URL;
  }

  async createSession(sessionName, webhookUrl = 'http://n8n:5678/webhook/waha-inbound') {
    try {
      console.log(`Creating session: ${sessionName}`);
      
      const response = await axios.post(`${this.baseURL}/sessions/add`, {
        name: sessionName,
        config: {
          webhook: webhookUrl,
          webhookByEvents: false,
          webhookBase64: false
        }
      });

      console.log('✅ Session created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating session:', error.response?.data || error.message);
      throw error;
    }
  }

  async startSession(sessionName) {
    try {
      console.log(`Starting session: ${sessionName}`);
      
      const response = await axios.get(`${this.baseURL}/${sessionName}/start`);
      
      console.log('✅ Session started successfully');
      console.log('📱 QR Code URL:', `${this.baseURL}/${sessionName}/qr`);
      console.log('📱 Scan this QR code with WhatsApp to connect your session');
      
      return response.data;
    } catch (error) {
      console.error('❌ Error starting session:', error.response?.data || error.message);
      throw error;
    }
  }

  async getSessionState(sessionName) {
    try {
      const response = await axios.get(`${this.baseURL}/${sessionName}/state`);
      console.log(`📊 Session state for ${sessionName}:`, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting session state:', error.response?.data || error.message);
      throw error;
    }
  }

  async getQRCode(sessionName) {
    try {
      const response = await axios.get(`${this.baseURL}/${sessionName}/qr`);
      console.log(`📱 QR Code for session ${sessionName}:`, response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error getting QR code:', error.response?.data || error.message);
      throw error;
    }
  }

  async listSessions() {
    try {
      const response = await axios.get(`${this.baseURL}/sessions`);
      console.log('📋 Available sessions:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error listing sessions:', error.response?.data || error.message);
      throw error;
    }
  }

  async deleteSession(sessionName) {
    try {
      const response = await axios.delete(`${this.baseURL}/sessions/${sessionName}`);
      console.log(`🗑️ Session ${sessionName} deleted successfully`);
      return response.data;
    } catch (error) {
      console.error('❌ Error deleting session:', error.response?.data || error.message);
      throw error;
    }
  }
}

// CLI Usage
async function main() {
  const manager = new WahaSessionManager();
  const command = process.argv[2];
  const sessionName = process.argv[3] || 'default-session';

  try {
    switch (command) {
      case 'create':
        await manager.createSession(sessionName);
        break;
      case 'start':
        await manager.startSession(sessionName);
        break;
      case 'state':
        await manager.getSessionState(sessionName);
        break;
      case 'qr':
        await manager.getQRCode(sessionName);
        break;
      case 'list':
        await manager.listSessions();
        break;
      case 'delete':
        await manager.deleteSession(sessionName);
        break;
      case 'setup':
        // Complete setup: create, start, and get QR
        await manager.createSession(sessionName);
        await manager.startSession(sessionName);
        await manager.getQRCode(sessionName);
        break;
      default:
        console.log(`
🔧 WAHA Session Manager

Usage: node waha-session-manager.js <command> [session-name]

Commands:
  create <name>    - Create a new session
  start <name>     - Start a session and get QR code URL
  state <name>     - Check session state
  qr <name>        - Get QR code data
  list             - List all sessions
  delete <name>    - Delete a session
  setup <name>     - Complete setup (create + start + QR)

Examples:
  node waha-session-manager.js setup my-whatsapp-session
  node waha-session-manager.js start default-session
  node waha-session-manager.js list
        `);
    }
  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = WahaSessionManager;
