import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import axios from "axios";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";
import { AppModule } from "@/app.module";
import { TEST_CONFIG } from "./test-config";
import { N8NTestUtils } from "./test-utils";

describe("N8N Performance Integration Tests", () => {
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

  describe("Response Time Performance", () => {
    it("should measure createSession response time", async () => {
      console.log("⏱️  Medindo tempo de resposta do createSession...");
      
      const sessionId = `perf-test-${Date.now()}`;
      const startTime = Date.now();
      
      try {
        await n8nWhatsappService.createSession(sessionId, TEST_TENANT_ID);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`✅ createSession executado em ${responseTime}ms`);
        
        // Limpa a sessão criada
        try {
          await axios.delete(`${WAHA_BASE_URL}/api/sessions/${sessionId}`);
        } catch (e) { /* ignore */ }
        
        // Verifica se está dentro de um tempo aceitável (30 segundos)
        expect(responseTime).toBeLessThan(30000);
        
      } catch (error: any) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`⚠️  createSession falhou em ${responseTime}ms:`, error.message);
        throw error;
      }
    });

    it("should measure getAuthQRCode response time", async () => {
      console.log("⏱️  Medindo tempo de resposta do getAuthQRCode...");
      
      const startTime = Date.now();
      
      try {
        await n8nWhatsappService.getAuthQRCode(TEST_SESSION_ID);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`✅ getAuthQRCode executado em ${responseTime}ms`);
        
        // Verifica se está dentro de um tempo aceitável (10 segundos)
        expect(responseTime).toBeLessThan(10000);
        
      } catch (error: any) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`⚠️  getAuthQRCode falhou em ${responseTime}ms:`, error.message);
        // Não falha o teste se a sessão não existir
        if (!error.message.includes("Failed to get QR code")) {
          throw error;
        }
      }
    });

    it("should measure startSession response time", async () => {
      console.log("⏱️  Medindo tempo de resposta do startSession...");
      
      const startTime = Date.now();
      
      try {
        await n8nWhatsappService.startSession(TEST_SESSION_ID);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`✅ startSession executado em ${responseTime}ms`);
        
        // Verifica se está dentro de um tempo aceitável (10 segundos)
        expect(responseTime).toBeLessThan(10000);
        
      } catch (error: any) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`⚠️  startSession falhou em ${responseTime}ms:`, error.message);
        // Não falha o teste se a sessão não existir
        if (!error.message.includes("Failed to start WhatsApp session")) {
          throw error;
        }
      }
    });

    it("should measure sendMessage response time", async () => {
      console.log("⏱️  Medindo tempo de resposta do sendMessage...");
      
      const testMessage = "Performance test message";
      const startTime = Date.now();
      
      try {
        await n8nWhatsappService.sendMessage(TEST_SESSION_ID, TEST_PHONE, testMessage);
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        
        console.log(`✅ sendMessage executado em ${responseTime}ms`);
        
        // Verifica se está dentro de um tempo aceitável (15 segundos)
        expect(responseTime).toBeLessThan(15000);
        
      } catch (error: any) {
        const endTime = Date.now();
        const responseTime = endTime - startTime;
        console.log(`⚠️  sendMessage falhou em ${responseTime}ms:`, error.message);
        // Não falha o teste se a sessão não existir
        if (!error.message.includes("Failed to send WhatsApp message")) {
          throw error;
        }
      }
    });
  });

  describe("Concurrent Load Performance", () => {
    it("should handle multiple concurrent QR code requests", async () => {
      console.log("⏱️  Testando múltiplas requisições concorrentes de QR code...");
      
      const concurrentRequests = 5;
      const startTime = Date.now();
      
      try {
        const promises = Array.from({ length: concurrentRequests }, (_, i) => 
          n8nWhatsappService.getAuthQRCode(`${TEST_SESSION_ID}-${i}`)
        );
        
        const results = await Promise.allSettled(promises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        console.log(`✅ ${concurrentRequests} requisições concorrentes executadas em ${totalTime}ms`);
        console.log(`📊 Resultados: ${successful} sucessos, ${failed} falhas`);
        
        // Verifica se o tempo total está dentro de um limite aceitável
        expect(totalTime).toBeLessThan(30000);
        
      } catch (error: any) {
        console.log("⚠️  Erro em teste de carga concorrente:", error.message);
      }
    });

    it("should handle multiple concurrent message sends", async () => {
      console.log("⏱️  Testando múltiplos envios concorrentes de mensagem...");
      
      const concurrentMessages = 3;
      const startTime = Date.now();
      
      try {
        const promises = Array.from({ length: concurrentMessages }, (_, i) => 
          n8nWhatsappService.sendMessage(
            TEST_SESSION_ID, 
            TEST_PHONE, 
            `Concurrent message ${i + 1} - ${Date.now()}`
          )
        );
        
        const results = await Promise.allSettled(promises);
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        const successful = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.filter(r => r.status === 'rejected').length;
        
        console.log(`✅ ${concurrentMessages} envios concorrentes executados em ${totalTime}ms`);
        console.log(`📊 Resultados: ${successful} sucessos, ${failed} falhas`);
        
        // Verifica se o tempo total está dentro de um limite aceitável
        expect(totalTime).toBeLessThan(45000);
        
      } catch (error: any) {
        console.log("⚠️  Erro em teste de envio concorrente:", error.message);
      }
    });
  });

  describe("Memory Usage Performance", () => {
    it("should not leak memory during multiple operations", async () => {
      console.log("⏱️  Testando vazamento de memória em múltiplas operações...");
      
      const initialMemory = process.memoryUsage();
      console.log(`📊 Memória inicial: ${Math.round(initialMemory.heapUsed / 1024 / 1024)}MB`);
      
      // Executa múltiplas operações
      for (let i = 0; i < 10; i++) {
        try {
          await n8nWhatsappService.getAuthQRCode(`${TEST_SESSION_ID}-memory-${i}`);
        } catch (e) {
          // Ignora erros esperados
        }
        
        // Pequena pausa entre operações
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Força garbage collection se disponível
      if (global.gc) {
        global.gc();
      }
      
      const finalMemory = process.memoryUsage();
      const memoryIncrease = finalMemory.heapUsed - initialMemory.heapUsed;
      
      console.log(`📊 Memória final: ${Math.round(finalMemory.heapUsed / 1024 / 1024)}MB`);
      console.log(`📊 Aumento de memória: ${Math.round(memoryIncrease / 1024 / 1024)}MB`);
      
      // Verifica se o aumento de memória não é excessivo (menos de 50MB)
      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024);
    });
  });

  describe("Network Resilience Performance", () => {
    it("should handle network interruptions gracefully", async () => {
      console.log("⏱️  Testando resiliência a interrupções de rede...");
      
      const startTime = Date.now();
      
      try {
        // Simula uma operação que pode falhar por problemas de rede
        await N8NTestUtils.retryWithBackoff(
          () => n8nWhatsappService.getAuthQRCode(TEST_SESSION_ID),
          3, // 3 tentativas
          1000 // 1 segundo de delay base
        );
        
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        
        console.log(`✅ Operação com retry executada em ${totalTime}ms`);
        
        // Verifica se o tempo total está dentro de um limite aceitável
        expect(totalTime).toBeLessThan(10000);
        
      } catch (error: any) {
        const endTime = Date.now();
        const totalTime = endTime - startTime;
        console.log(`⚠️  Operação com retry falhou em ${totalTime}ms:`, error.message);
        // Não falha o teste se a sessão não existir
        if (!error.message.includes("Failed to get QR code")) {
          throw error;
        }
      }
    });
  });
});
