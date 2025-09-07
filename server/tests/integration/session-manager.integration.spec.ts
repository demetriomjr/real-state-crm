import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import axios from "axios";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";
import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { AppModule } from "@/app.module";
import { TEST_CONFIG } from "./test-config";
import { N8NTestUtils } from "./test-utils";

describe("N8N SessionManager Integration Test", () => {
  let app: INestApplication;
  let n8nWhatsappService: N8NWhatsappService;
  let whatsappSessionRepository: WhatsappSessionRepository;

  const { WAHA_BASE_URL, SESSION_NAME, TEST_TENANT_ID, TEST_SESSION_ID, SESSION_CREATION_TIMEOUT } = TEST_CONFIG;
  const SESSION_ID = TEST_SESSION_ID; // ID consistente para todos os testes

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

  describe("SessionManager Hook Test", () => {
    it("should delete all existing WAHA sessions", async () => {
      console.log("🗑️  Verificando e deletando sessões WAHA existentes...");
      
      try {
        await N8NTestUtils.cleanupAllSessions();
        console.log("✅ Limpeza de sessões concluída com sucesso");
      } catch (error: any) {
        console.error("❌ Erro ao deletar sessões WAHA:", error.message);
        throw error;
      }
    });

    it("should create session via N8N SessionManager", async () => {
      console.log("🚀 Criando sessão via N8N SessionManager...");
      console.log(`📋 Session ID: ${SESSION_ID}`);
      console.log(`📋 Tenant ID: ${TEST_TENANT_ID}`);
      
      try {
        // Chama o SessionManager do N8N
        const result = await n8nWhatsappService.createSession(SESSION_ID, TEST_TENANT_ID);
        console.log("✅ Sessão criada via N8N SessionManager:", result);
        expect(result).toBeDefined();
        
        // Verifica se a resposta tem o formato esperado (status 200)
        if (result.status === 200) {
          console.log("✅ Sessão criada com sucesso (status 200)");
        } else if (result.status === 404) {
          console.log("ℹ️  Sessão já existe e está funcionando (status 404)");
        } else {
          console.log(`⚠️  Resposta inesperada: ${JSON.stringify(result)}`);
        }
        
      } catch (error: any) {
        console.error("❌ Erro ao criar sessão via N8N SessionManager:", error.message);
        throw error;
      }
    });

    it("should verify session was created in WAHA", async () => {
      console.log("🔍 Verificando se sessão foi criada no WAHA...");
      
      try {
        // Aguarda o N8N processar (20s wait no workflow + tempo de criação)
        await new Promise(resolve => setTimeout(resolve, SESSION_CREATION_TIMEOUT + 20000));
        
        const createdSession = await N8NTestUtils.verifySessionExists();
        
        expect(createdSession).toBeDefined();
        expect(createdSession.name).toBe(SESSION_NAME);
        console.log("✅ Sessão encontrada no WAHA:", {
          name: createdSession.name,
          status: createdSession.status
        });
        
      } catch (error: any) {
        console.error("❌ Erro ao verificar sessão no WAHA:", error.message);
        throw error;
      }
    });

    it("should verify session was persisted in database", async () => {
      console.log("🔍 Verificando se sessão foi persistida no banco de dados...");
      
      try {
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

    it("should generate QR code via SessionAuth", async () => {
      console.log("📱 Gerando QR code via SessionAuth...");
      
      try {
        const qrResult = await n8nWhatsappService.getAuthQRCode(SESSION_ID);
        console.log("✅ QR code gerado via SessionAuth:", qrResult);
        expect(qrResult).toBeDefined();
        
      } catch (error: any) {
        console.error("❌ Erro ao gerar QR code via SessionAuth:", error.message);
        throw error;
      }
    });

    it("should stop session for next test", async () => {
      console.log("🛑 Parando sessão para próximo teste...");
      
      try {
        await N8NTestUtils.ensureSessionStatus("STOPPED");
        console.log("✅ Sessão parada com sucesso para próximo teste");
      } catch (error: any) {
        console.error("❌ Erro ao parar sessão:", error.message);
        throw error;
      }
    });
  });
});
