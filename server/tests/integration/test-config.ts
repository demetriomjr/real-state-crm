// Configuração para testes de integração
export const TEST_CONFIG = {
  // WAHA Configuration
  WAHA_BASE_URL: "http://localhost:3100",
  SESSION_NAME: "default", // Obrigatório ser "default" na versão atual do WAHA
  
  // N8N Configuration
  N8N_BASE_URL: process.env.N8N_BASE_URL || "http://localhost:5678",
  
  // Test Configuration
  TEST_TENANT_ID: "test-tenant-123",
  TEST_PHONE: "5511999999999", // Substitua pelo seu número de teste
  TEST_SESSION_ID: "test-session-123", // ID consistente para todos os testes
  
  // Timeouts
  SESSION_CREATION_TIMEOUT: 5000, // 5 segundos
  AUTHENTICATION_TIMEOUT: 3000,   // 3 segundos
  QR_CODE_TIMEOUT: 30000,         // 30 segundos para escanear QR code
  SESSION_START_TIMEOUT: 20000,   // 20 segundos para sessão iniciar
  
  // File paths
  QR_CODE_PATH: "whatsapp-qr-code.png",
};

// Função para aguardar input do usuário
export const waitForUserInput = (question: string): Promise<string> => {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer: string) => {
      rl.close();
      resolve(answer);
    });
  });
};

// Função para abrir arquivo no Chrome
export const openInChrome = async (filePath: string): Promise<void> => {
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  try {
    await execAsync(`start chrome "${filePath}"`);
    console.log("🌐 QR code aberto no Chrome");
  } catch (error) {
    console.log("⚠️  Não foi possível abrir automaticamente no Chrome");
    console.log("📁 Abra manualmente:", filePath);
  }
};

// Função para salvar QR code
export const saveQRCode = async (qrData: any, filePath: string): Promise<void> => {
  const fs = require('fs');
  const axios = require('axios');
  
  try {
    // Se o QR code vem como base64, salva como imagem
    if (qrData.qr && qrData.qr.startsWith('data:image')) {
      const base64Data = qrData.qr.replace(/^data:image\/png;base64,/, '');
      fs.writeFileSync(filePath, base64Data, 'base64');
      console.log("💾 QR code salvo em:", filePath);
    } else if (qrData.qr) {
      // Se vem como URL, baixa a imagem
      const qrResponse = await axios.get(qrData.qr, { responseType: 'arraybuffer' });
      fs.writeFileSync(filePath, qrResponse.data);
      console.log("💾 QR code baixado e salvo em:", filePath);
    }
  } catch (error) {
    console.error("❌ Erro ao salvar QR code:", error);
    throw error;
  }
};
