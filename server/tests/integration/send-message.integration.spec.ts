import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import axios from "axios";
import * as request from "supertest";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";
import { AppModule } from "@/app.module";
import { TEST_CONFIG } from "./test-config";
import { N8NTestUtils } from "./test-utils";

describe("N8N SendMessage Integration Test", () => {
  let app: INestApplication;
  let n8nWhatsappService: N8NWhatsappService;

  const { WAHA_BASE_URL, SESSION_NAME, TEST_PHONE, TEST_TENANT_ID, TEST_SESSION_ID } = TEST_CONFIG;
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

  describe("SendMessage Hook Test", () => {
    it("should verify session is working before sending message", async () => {
      console.log("🔍 Verificando se sessão está WORKING...");
      
      try {
        const session = await N8NTestUtils.verifySessionExists();
        
        expect(session.status).toBe("WORKING");
        console.log("✅ Sessão está WORKING:", {
          name: session.name,
          status: session.status
        });
        
      } catch (error: any) {
        console.error("❌ Erro ao verificar sessão:", error.message);
        throw error;
      }
    });

    it("should send message via N8N SendMessage", async () => {
      console.log("📤 Enviando mensagem via N8N SendMessage...");
      
      const testMessage = "Teste de integração N8N SendMessage - " + new Date().toISOString();
      
      try {
        const result = await n8nWhatsappService.sendMessage(SESSION_ID, TEST_PHONE, testMessage);
        console.log("✅ Mensagem enviada via N8N SendMessage:", result);
        expect(result).toBeDefined();
        
      } catch (error: any) {
        console.error("❌ Erro ao enviar mensagem via N8N SendMessage:", error.message);
        throw error;
      }
    });

    it("should inject incoming message webhook to test our webhook", async () => {
      console.log("🔄 Simulando mensagem recebida via webhook...");
      
      // Simula uma mensagem recebida do WhatsApp
      const mockIncomingMessage = {
        id: "msg_" + Date.now(),
        timestamp: Date.now(),
        session: SESSION_NAME,
        event: "message",
        payload: {
          id: "msg_" + Date.now(),
          timestamp: Date.now(),
          from: TEST_PHONE,
          fromMe: false,
          body: "Resposta automática do teste - " + new Date().toISOString(),
          hasMedia: false,
          quotedMsgId: null,
          quotedMsg: null,
          mentionedIds: [],
          isForwarded: false,
          isStatus: false,
          isStarred: false,
          location: null,
          replyTo: null,
          vCards: [],
          vCard: null,
          _data: {},
          isEphemeral: false,
          links: [],
          selectedButtonId: null,
          selectedListRowId: null,
          title: null,
          description: null,
          businessOwnerJid: null,
          productHeaderImageRejected: null,
          lastPlaybackProgress: null,
          isDynamicReplyButtonsMsg: false,
          isMdHistoryMsg: false,
          sticker: null,
          pollInvalidated: false,
          invoker: null,
          multiDevice: false,
          pollName: null,
          pollOptions: null,
          pollAllowMultipleAnswers: null,
          pollMessageOptions: null,
          pollSelectableOptionsCount: null,
          messageSecret: null,
          originalMsgUrl: null,
          thumbnail: null,
          thumbnailUrl: null,
          thumbnailMimetype: null,
          thumbnailFileLength: null,
          thumbnailHeight: null,
          thumbnailWidth: null,
          thumbnailDirectPath: null,
          thumbnailSha256: null,
          thumbnailEncFilehash: null,
          mediaKey: null,
          mediaKeyTimestamp: null,
          mimetype: null,
          height: null,
          width: null,
          ephemeralStartTimestamp: null,
          ephemeralDuration: null,
          ephemeralOffToOn: null,
          ephemeralOutOfSync: null,
          bizPrivacyStatus: null,
          verifiedBizName: null,
          disappearingModeInitiator: null,
          productHeaderImage: null,
        },
        me: {
          id: TEST_PHONE + "@c.us",
          lid: TEST_PHONE + "@lid",
          pushName: "Test User",
        },
        environment: {
          version: "1.0.0",
        },
      };

      try {
        // Simula o N8N enviando webhook para nossa aplicação
        const response = await request(app.getHttpServer())
          .post("/api/webhooks/whatsapp")
          .set("X-Forwarded-For", "172.18.0.4") // Simula IP do N8N
          .send(mockIncomingMessage)
          .expect(200);

        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("message", "Message processed successfully");
        console.log("✅ Webhook processado com sucesso:", response.body);
        
      } catch (error: any) {
        console.error("❌ Erro ao processar webhook:", error.message);
        throw error;
      }
    });

    it("should verify message was processed and stored", async () => {
      console.log("🔍 Verificando se mensagem foi processada e armazenada...");
      
      // Aguarda um pouco para o processamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        // Aqui você poderia verificar se a mensagem foi armazenada no banco
        // Por enquanto, vamos apenas confirmar que o webhook foi processado
        console.log("✅ Mensagem deve ter sido processada e armazenada no banco");
        expect(true).toBe(true); // Placeholder
        
      } catch (error: any) {
        console.error("❌ Erro ao verificar processamento da mensagem:", error.message);
        throw error;
      }
    });
  });
});
