import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import axios from "axios";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";
import { AppModule } from "@/app.module";
import { TEST_CONFIG } from "./test-config";
import { N8NTestUtils } from "./test-utils";

describe("N8N SessionStart Integration Test", () => {
  let app: INestApplication;
  let n8nWhatsappService: N8NWhatsappService;

  const { WAHA_BASE_URL, SESSION_NAME, TEST_TENANT_ID, TEST_SESSION_ID, SESSION_START_TIMEOUT } = TEST_CONFIG;
  const SESSION_ID = TEST_SESSION_ID; // ID da sessão que criamos no banco

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    n8nWhatsappService = moduleFixture.get<N8NWhatsappService>(N8NWhatsappService);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("SessionStart Hook Test", () => {
    it("should verify session exists and is stopped", async () => {
      console.log("🔍 Verificando se sessão existe e está parada...");
      
      try {
        const session = await N8NTestUtils.verifySessionExists();
        expect(session).toBeDefined();
        console.log("✅ Sessão encontrada:", {
          name: session.name,
          status: session.status
        });
        
        await N8NTestUtils.ensureSessionStatus("STOPPED");
        console.log("✅ Sessão está parada, pode prosseguir");
        
      } catch (error: any) {
        console.error("❌ Erro ao verificar sessão:", error.message);
        throw error;
      }
    });

    it("should start session via N8N SessionStart", async () => {
      console.log("🚀 Iniciando sessão via N8N SessionStart...");
      console.log(`📋 Session ID: ${SESSION_ID}`);
      
      try {
        // Chama o SessionStart do N8N
        const result = await n8nWhatsappService.startSession(SESSION_ID);
        console.log("✅ Sessão iniciada via N8N SessionStart:", result);
        expect(result).toBeDefined();
        
        // Verifica se a resposta tem o formato esperado
        if (result.status === 200) {
          console.log("✅ Sessão iniciada com sucesso (status 200)");
        } else if (result.status === 404) {
          console.log("❌ Sessão não encontrada (status 404)");
          throw new Error("Session not found in database or WAHA");
        } else {
          console.log(`⚠️  Resposta inesperada: ${JSON.stringify(result)}`);
        }
        
      } catch (error: any) {
        console.error("❌ Erro ao iniciar sessão via N8N SessionStart:", error.message);
        throw error;
      }
    });

    it("should verify session is now working", async () => {
      console.log("🔍 Verificando se sessão está WORKING...");
      
      try {
        // Aguarda o N8N processar (15s wait no workflow)
        await new Promise(resolve => setTimeout(resolve, SESSION_START_TIMEOUT));
        
        const session = await N8NTestUtils.verifySessionExists();
        
        // Aceita tanto WORKING quanto STARTING como sucesso
        expect(["WORKING", "STARTING"]).toContain(session.status);
        console.log("✅ Sessão está funcionando:", {
          name: session.name,
          status: session.status
        });
        
      } catch (error: any) {
        console.error("❌ Erro ao verificar status da sessão:", error.message);
        throw error;
      }
    });
  });
});
