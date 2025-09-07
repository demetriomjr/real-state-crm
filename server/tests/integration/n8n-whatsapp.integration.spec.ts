import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import axios from "axios";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";
import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { AppModule } from "@/app.module";
import { TEST_CONFIG, waitForUserInput, openInChrome, saveQRCode } from "./test-config";

describe("N8N WhatsApp Integration Tests", () => {
  let app: INestApplication;
  let n8nWhatsappService: N8NWhatsappService;
  let whatsappSessionRepository: WhatsappSessionRepository;

  // Usar configuração centralizada
  const { WAHA_BASE_URL, SESSION_NAME, TEST_TENANT_ID, TEST_PHONE, QR_CODE_PATH } = TEST_CONFIG;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    n8nWhatsappService = moduleFixture.get<N8NWhatsappService>(N8NWhatsappService);
    whatsappSessionRepository = moduleFixture.get<WhatsappSessionRepository>(WhatsappSessionRepository);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("WAHA Session Management", () => {
    it("should delete existing WAHA session", async () => {
      console.log("🗑️  Deletando sessão WAHA existente...");
      
      try {
        const response = await axios.delete(`${WAHA_BASE_URL}/api/sessions/${SESSION_NAME}`);
        console.log("✅ Sessão WAHA deletada com sucesso");
        expect(response.status).toBe(200);
      } catch (error: any) {
        if (error.response?.status === 404) {
          console.log("ℹ️  Sessão WAHA não existia (404) - OK");
        } else {
          console.error("❌ Erro ao deletar sessão WAHA:", error.message);
          throw error;
        }
      }
    });

    it("should verify WAHA session is deleted", async () => {
      console.log("🔍 Verificando se sessão WAHA foi deletada...");
      
      try {
        const response = await axios.get(`${WAHA_BASE_URL}/api/sessions`);
        const sessions = response.data;
        const defaultSession = sessions.find((s: any) => s.name === SESSION_NAME);
        
        expect(defaultSession).toBeUndefined();
        console.log("✅ Confirmação: Sessão WAHA não existe mais");
      } catch (error: any) {
        console.error("❌ Erro ao verificar sessões WAHA:", error.message);
        throw error;
      }
    });
  });

  describe("N8N Session Creation", () => {
    it("should create new session via N8N SessionManager", async () => {
      console.log("🚀 Criando nova sessão via N8N SessionManager...");
      
      try {
        // Chama o SessionManager do N8N (que é o que nosso N8NWhatsappService faz)
        const result = await n8nWhatsappService.createSession(SESSION_NAME, TEST_TENANT_ID);
        console.log("✅ Sessão criada via N8N SessionManager:", result);
        expect(result).toBeDefined();
      } catch (error: any) {
        console.error("❌ Erro ao criar sessão via N8N SessionManager:", error.message);
        throw error;
      }
    });

    it("should verify session exists in WAHA after N8N creation", async () => {
      console.log("🔍 Verificando se sessão foi criada no WAHA...");
      
      // Aguarda o N8N processar (20s wait no workflow + tempo de criação)
      await new Promise(resolve => setTimeout(resolve, 25000));
      
      try {
        const response = await axios.get(`${WAHA_BASE_URL}/api/sessions`);
        const sessions = response.data;
        const defaultSession = sessions.find((s: any) => s.name === SESSION_NAME);
        
        expect(defaultSession).toBeDefined();
        expect(defaultSession.name).toBe(SESSION_NAME);
        console.log("✅ Sessão encontrada no WAHA:", defaultSession);
      } catch (error: any) {
        console.error("❌ Erro ao verificar sessão no WAHA:", error.message);
        throw error;
      }
    });

    it("should verify session exists in our database", async () => {
      console.log("🔍 Verificando se sessão foi criada no nosso banco de dados...");
      
      try {
        // Verifica se a sessão foi persistida no banco via N8N
        const sessionInDb = await whatsappSessionRepository.findByName(SESSION_NAME);
        
        expect(sessionInDb).toBeDefined();
        expect(sessionInDb?.session_name).toBe(SESSION_NAME);
        console.log("✅ Sessão encontrada no banco de dados:", {
          id: sessionInDb?.id,
          session_name: sessionInDb?.session_name,
          status: sessionInDb?.status
        });
      } catch (error: any) {
        console.error("❌ Erro ao verificar sessão no banco:", error.message);
        throw error;
      }
    });
  });

  describe("QR Code Generation and Authentication", () => {
    it("should get QR code and open in browser", async () => {
      console.log("📱 Obtendo QR code para autenticação...");
      
      try {
        const qrResult = await n8nWhatsappService.getAuthQRCode(SESSION_NAME);
        console.log("✅ QR code obtido:", qrResult);
        
        // Salva QR code como imagem
        const path = require('path');
        const qrImagePath = path.join(process.cwd(), QR_CODE_PATH);
        
        await saveQRCode(qrResult, qrImagePath);
        
        // Abre no Chrome
        await openInChrome(qrImagePath);
        
        // Aguarda confirmação do usuário
        console.log("\n" + "=".repeat(60));
        console.log("📱 INSTRUÇÕES PARA AUTENTICAÇÃO:");
        console.log("1. Escaneie o QR code com seu WhatsApp");
        console.log("2. Aguarde a autenticação ser concluída");
        console.log("3. Digite 'y' e pressione Enter quando estiver pronto");
        console.log("=".repeat(60) + "\n");
        
        const userInput = await waitForUserInput("✅ Autenticação concluída? (y/n): ");
        
        if (userInput.toLowerCase() !== 'y') {
          throw new Error("Teste cancelado pelo usuário");
        }
        
        expect(qrResult).toBeDefined();
      } catch (error: any) {
        console.error("❌ Erro ao obter QR code:", error.message);
        throw error;
      }
    });

    it("should verify session is authenticated", async () => {
      console.log("🔐 Verificando se sessão está autenticada...");
      
      // Aguarda um pouco para a autenticação ser processada
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      try {
        const response = await axios.get(`${WAHA_BASE_URL}/api/sessions/${SESSION_NAME}`);
        const session = response.data;
        
        expect(session.status).toBe("WORKING");
        console.log("✅ Sessão autenticada:", session.status);
      } catch (error: any) {
        console.error("❌ Erro ao verificar autenticação:", error.message);
        throw error;
      }
    });
  });

  describe("Message Sending", () => {
    it("should send test message via N8N", async () => {
      console.log("📤 Enviando mensagem de teste via N8N...");
      
      const testMessage = "Teste de integração N8N - " + new Date().toISOString();
      
      console.log(`📱 Enviando para: ${TEST_PHONE}`);
      console.log(`💬 Mensagem: ${testMessage}`);
      
      try {
        const result = await n8nWhatsappService.sendMessage(SESSION_NAME, TEST_PHONE, testMessage);
        console.log("✅ Mensagem enviada via N8N:", result);
        expect(result).toBeDefined();
      } catch (error: any) {
        console.error("❌ Erro ao enviar mensagem via N8N:", error.message);
        throw error;
      }
    });
  });

  describe("Cleanup", () => {
    it("should cleanup test session", async () => {
      console.log("🧹 Limpando sessão de teste...");
      
      try {
        await axios.delete(`${WAHA_BASE_URL}/api/sessions/${SESSION_NAME}`);
        console.log("✅ Sessão de teste removida");
      } catch (error: any) {
        console.log("ℹ️  Sessão já foi removida ou não existia");
      }
    });
  });
});