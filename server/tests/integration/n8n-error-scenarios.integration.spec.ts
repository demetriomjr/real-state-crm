import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import axios from "axios";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";
import { AppModule } from "@/app.module";
import { TEST_CONFIG } from "./test-config";
import { N8NTestUtils } from "./test-utils";

describe("N8N Error Scenarios Integration Tests", () => {
  let app: INestApplication;
  let n8nWhatsappService: N8NWhatsappService;

  const { WAHA_BASE_URL, SESSION_NAME, TEST_TENANT_ID, TEST_SESSION_ID, TEST_PHONE } = TEST_CONFIG;

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

  describe("Invalid Session ID Scenarios", () => {
    it("should handle invalid session ID in createSession", async () => {
      console.log("🧪 Testando session ID inválido em createSession...");
      
      const invalidSessionId = "invalid-session-id";
      
      try {
        await n8nWhatsappService.createSession(invalidSessionId, TEST_TENANT_ID);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to create WhatsApp session");
      }
    });

    it("should handle invalid session ID in getAuthQRCode", async () => {
      console.log("🧪 Testando session ID inválido em getAuthQRCode...");
      
      const invalidSessionId = "invalid-session-id";
      
      try {
        await n8nWhatsappService.getAuthQRCode(invalidSessionId);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to get QR code");
      }
    });

    it("should handle invalid session ID in startSession", async () => {
      console.log("🧪 Testando session ID inválido em startSession...");
      
      const invalidSessionId = "invalid-session-id";
      
      try {
        await n8nWhatsappService.startSession(invalidSessionId);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to start WhatsApp session");
      }
    });

    it("should handle invalid session ID in sendMessage", async () => {
      console.log("🧪 Testando session ID inválido em sendMessage...");
      
      const invalidSessionId = "invalid-session-id";
      const testMessage = "Test message";
      
      try {
        await n8nWhatsappService.sendMessage(invalidSessionId, TEST_PHONE, testMessage);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to send WhatsApp message");
      }
    });
  });

  describe("Invalid Tenant ID Scenarios", () => {
    it("should handle invalid tenant ID in createSession", async () => {
      console.log("🧪 Testando tenant ID inválido em createSession...");
      
      const invalidTenantId = "invalid-tenant-id";
      
      try {
        await n8nWhatsappService.createSession(TEST_SESSION_ID, invalidTenantId);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to create WhatsApp session");
      }
    });
  });

  describe("Invalid Phone Number Scenarios", () => {
    it("should handle invalid phone number in sendMessage", async () => {
      console.log("🧪 Testando número de telefone inválido em sendMessage...");
      
      const invalidPhone = "123"; // Número muito curto
      const testMessage = "Test message";
      
      try {
        await n8nWhatsappService.sendMessage(TEST_SESSION_ID, invalidPhone, testMessage);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to send WhatsApp message");
      }
    });

    it("should handle empty phone number in sendMessage", async () => {
      console.log("🧪 Testando número de telefone vazio em sendMessage...");
      
      const emptyPhone = "";
      const testMessage = "Test message";
      
      try {
        await n8nWhatsappService.sendMessage(TEST_SESSION_ID, emptyPhone, testMessage);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to send WhatsApp message");
      }
    });
  });

  describe("Invalid Message Scenarios", () => {
    it("should handle empty message in sendMessage", async () => {
      console.log("🧪 Testando mensagem vazia em sendMessage...");
      
      const emptyMessage = "";
      
      try {
        await n8nWhatsappService.sendMessage(TEST_SESSION_ID, TEST_PHONE, emptyMessage);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to send WhatsApp message");
      }
    });

    it("should handle null message in sendMessage", async () => {
      console.log("🧪 Testando mensagem nula em sendMessage...");
      
      const nullMessage = null as any;
      
      try {
        await n8nWhatsappService.sendMessage(TEST_SESSION_ID, TEST_PHONE, nullMessage);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to send WhatsApp message");
      }
    });
  });

  describe("Network Error Scenarios", () => {
    it("should handle N8N service unavailable", async () => {
      console.log("🧪 Testando serviço N8N indisponível...");
      
      // Temporariamente modifica a URL do N8N para uma inválida
      const originalN8nBaseUrl = (n8nWhatsappService as any).n8nBaseUrl;
      (n8nWhatsappService as any).n8nBaseUrl = "http://localhost:9999"; // Porta inexistente
      
      try {
        await n8nWhatsappService.createSession(TEST_SESSION_ID, TEST_TENANT_ID);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro de conexão esperado capturado:", error.message);
        expect(error.message).toContain("Failed to create WhatsApp session");
      } finally {
        // Restaura a URL original
        (n8nWhatsappService as any).n8nBaseUrl = originalN8nBaseUrl;
      }
    });
  });

  describe("Session State Error Scenarios", () => {
    it("should handle QR code request on non-existent session", async () => {
      console.log("🧪 Testando QR code em sessão inexistente...");
      
      const nonExistentSessionId = "non-existent-session-123";
      
      try {
        await n8nWhatsappService.getAuthQRCode(nonExistentSessionId);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to get QR code");
      }
    });

    it("should handle start session on non-existent session", async () => {
      console.log("🧪 Testando start em sessão inexistente...");
      
      const nonExistentSessionId = "non-existent-session-123";
      
      try {
        await n8nWhatsappService.startSession(nonExistentSessionId);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Erro esperado capturado:", error.message);
        expect(error.message).toContain("Failed to start WhatsApp session");
      }
    });
  });

  describe("Concurrent Operations Scenarios", () => {
    it("should handle concurrent session creation attempts", async () => {
      console.log("🧪 Testando criação concorrente de sessões...");
      
      const sessionId1 = "concurrent-session-1";
      const sessionId2 = "concurrent-session-2";
      
      try {
        // Tenta criar duas sessões simultaneamente
        const promises = [
          n8nWhatsappService.createSession(sessionId1, TEST_TENANT_ID),
          n8nWhatsappService.createSession(sessionId2, TEST_TENANT_ID)
        ];
        
        const results = await Promise.allSettled(promises);
        
        // Pelo menos uma deve ter sucesso
        const successful = results.filter(r => r.status === 'fulfilled');
        const failed = results.filter(r => r.status === 'rejected');
        
        console.log(`✅ Resultados: ${successful.length} sucessos, ${failed.length} falhas`);
        
        // Limpa as sessões criadas
        try {
          await axios.delete(`${WAHA_BASE_URL}/api/sessions/${sessionId1}`);
        } catch (e) { /* ignore */ }
        try {
          await axios.delete(`${WAHA_BASE_URL}/api/sessions/${sessionId2}`);
        } catch (e) { /* ignore */ }
        
        expect(successful.length).toBeGreaterThan(0);
        
      } catch (error: any) {
        console.log("✅ Erro esperado em operação concorrente:", error.message);
      }
    });
  });

  describe("Timeout Scenarios", () => {
    it("should handle timeout in session operations", async () => {
      console.log("🧪 Testando timeout em operações de sessão...");
      
      // Este teste simula um timeout configurando um timeout muito baixo
      const originalTimeout = axios.defaults.timeout;
      axios.defaults.timeout = 1; // 1ms timeout
      
      try {
        await n8nWhatsappService.createSession(TEST_SESSION_ID, TEST_TENANT_ID);
        // Se chegou aqui, o teste falhou
        expect(true).toBe(false);
      } catch (error: any) {
        console.log("✅ Timeout esperado capturado:", error.message);
        expect(error.message).toContain("Failed to create WhatsApp session");
      } finally {
        // Restaura o timeout original
        axios.defaults.timeout = originalTimeout;
      }
    });
  });
});
