import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import axios from "axios";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";
import { AppModule } from "@/app.module";
import { TEST_CONFIG, waitForUserInput, openInChrome, saveQRCode } from "./test-config";
import { N8NTestUtils } from "./test-utils";

describe("N8N SessionAuth Integration Test", () => {
  let app: INestApplication;
  let n8nWhatsappService: N8NWhatsappService;

  const { WAHA_BASE_URL, SESSION_NAME, QR_CODE_PATH, TEST_TENANT_ID, TEST_SESSION_ID } = TEST_CONFIG;
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

  describe("SessionAuth Hook Test", () => {
    it("should ensure session is working before generating QR", async () => {
      console.log("🔍 Verificando se sessão está WORKING...");
      
      try {
        await N8NTestUtils.ensureSessionStatus("WORKING");
        console.log("✅ Sessão está WORKING, pode prosseguir");
      } catch (error: any) {
        console.error("❌ Erro ao verificar/iniciar sessão:", error.message);
        throw error;
      }
    });

    it("should generate QR code via SessionAuth", async () => {
      console.log("📱 Gerando QR code via SessionAuth...");
      
      try {
        const qrResult = await n8nWhatsappService.getAuthQRCode(SESSION_ID);
        console.log("✅ QR code gerado via SessionAuth:", qrResult);
        expect(qrResult).toBeDefined();
        
        // Salva QR code como imagem
        const path = require('path');
        const qrImagePath = path.join(process.cwd(), QR_CODE_PATH);
        
        await saveQRCode(qrResult, qrImagePath);
        
        // Abre no Chrome
        await openInChrome(qrImagePath);
        
        console.log("\n" + "=".repeat(60));
        console.log("📱 INSTRUÇÕES PARA AUTENTICAÇÃO:");
        console.log("1. Escaneie o QR code com seu WhatsApp");
        console.log("2. Aguarde a autenticação ser concluída");
        console.log("3. Digite 'y' e pressione Enter quando estiver pronto");
        console.log("=".repeat(60) + "\n");
        
        const userInput = await waitForUserInput("✅ QR Code escaneado e autenticado? (y/n): ");
        
        if (userInput.toLowerCase() !== 'y') {
          throw new Error("Teste cancelado pelo usuário - QR Code não foi autenticado");
        }
        
        console.log("✅ QR Code autenticado com sucesso!");
        
      } catch (error: any) {
        console.error("❌ Erro ao gerar/autenticar QR code:", error.message);
        throw error;
      }
    });

    it("should verify session is authenticated", async () => {
      console.log("🔐 Verificando se sessão está autenticada...");
      
      // Aguarda um pouco para a autenticação ser processada
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      try {
        const session = await N8NTestUtils.verifySessionExists();
        
        expect(session.status).toBe("WORKING");
        console.log("✅ Sessão autenticada e WORKING:", {
          name: session.name,
          status: session.status
        });
        
      } catch (error: any) {
        console.error("❌ Erro ao verificar autenticação:", error.message);
        throw error;
      }
    });
  });
});
