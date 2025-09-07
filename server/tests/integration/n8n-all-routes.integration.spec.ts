import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import axios from "axios";
import * as request from "supertest";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";
import { WhatsappSessionRepository } from "@/Infrastructure/Repositories/whatsapp-session.repository";
import { AppModule } from "@/app.module";
import { TEST_CONFIG } from "./test-config";
import { N8NTestUtils } from "./test-utils";

describe("N8N All Routes Integration Tests", () => {
  let app: INestApplication;
  let n8nWhatsappService: N8NWhatsappService;
  let whatsappSessionRepository: WhatsappSessionRepository;

  const { 
    WAHA_BASE_URL, 
    SESSION_NAME, 
    TEST_TENANT_ID, 
    TEST_SESSION_ID, 
    TEST_PHONE,
    N8N_BASE_URL 
  } = TEST_CONFIG;

  // Test data generators
  const generateValidUUID = () => "12345678-1234-1234-1234-123456789012";
  const generateInvalidUUID = () => "invalid-uuid";
  const generateValidPhone = () => "5511999999999";
  const generateInvalidPhone = () => "123";

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

  beforeEach(async () => {
    // Clean up before each test - skip for now to avoid dependency issues
    // try {
    //   await N8NTestUtils.cleanupAllSessions();
    // } catch (error) {
    //   // Ignore cleanup errors
    // }
  });

  describe("SessionManager Hook - POST /whatsapp/sessions", () => {
    const endpoint = `${N8N_BASE_URL}/webhook/whatsapp/sessions`;

    it("should create session with valid data", async () => {
      console.log("🚀 Testing SessionManager with valid data...");
      
      const validPayload = {
        session_id: generateValidUUID(),
        tenant_id: generateValidUUID()
      };

      try {
        const response = await axios.post(endpoint, validPayload);

        expect(response.data).toHaveProperty("status", 200);
        expect(response.data).toHaveProperty("message", "success");
        console.log("✅ SessionManager valid test passed:", response.data);
        
      } catch (error: any) {
        console.error("❌ SessionManager valid test failed:", error.message);
        throw error;
      }
    });

    it("should reject session with invalid session_id", async () => {
      console.log("🚫 Testing SessionManager with invalid session_id...");
      
      const invalidPayload = {
        session_id: generateInvalidUUID(),
        tenant_id: generateValidUUID()
      };

      try {
        const response = await axios.post(endpoint, invalidPayload);

        expect(response.data).toHaveProperty("status", 500);
        expect(response.data.message).toContain("UUID");
        console.log("✅ SessionManager invalid session_id test passed:", response.data);
        
      } catch (error: any) {
        console.error("❌ SessionManager invalid session_id test failed:", error.message);
        throw error;
      }
    });

    it("should reject session with invalid tenant_id", async () => {
      console.log("🚫 Testing SessionManager with invalid tenant_id...");
      
      const invalidPayload = {
        session_id: generateValidUUID(),
        tenant_id: generateInvalidUUID()
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        expect(response.body.message).toContain("UUID");
        console.log("✅ SessionManager invalid tenant_id test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SessionManager invalid tenant_id test failed:", error.message);
        throw error;
      }
    });

    it("should reject session with missing session_id", async () => {
      console.log("🚫 Testing SessionManager with missing session_id...");
      
      const invalidPayload = {
        tenant_id: generateValidUUID()
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        console.log("✅ SessionManager missing session_id test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SessionManager missing session_id test failed:", error.message);
        throw error;
      }
    });

    it("should reject session with missing tenant_id", async () => {
      console.log("🚫 Testing SessionManager with missing tenant_id...");
      
      const invalidPayload = {
        session_id: generateValidUUID()
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        console.log("✅ SessionManager missing tenant_id test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SessionManager missing tenant_id test failed:", error.message);
        throw error;
      }
    });
  });

  describe("StartSession Hook - POST /whatsapp/session/start", () => {
    const endpoint = "/whatsapp/session/start";

    it("should start session with valid session_id", async () => {
      console.log("🚀 Testing StartSession with valid session_id...");
      
      const validPayload = {
        session_id: generateValidUUID()
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(validPayload)
          .expect(200);

        expect(response.body).toHaveProperty("status", 200);
        expect(response.body).toHaveProperty("message", "success");
        console.log("✅ StartSession valid test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ StartSession valid test failed:", error.message);
        throw error;
      }
    });

    it("should reject start session with invalid session_id", async () => {
      console.log("🚫 Testing StartSession with invalid session_id...");
      
      const invalidPayload = {
        session_id: generateInvalidUUID()
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        expect(response.body.message).toContain("UUID");
        console.log("✅ StartSession invalid session_id test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ StartSession invalid session_id test failed:", error.message);
        throw error;
      }
    });

    it("should reject start session with missing session_id", async () => {
      console.log("🚫 Testing StartSession with missing session_id...");
      
      const invalidPayload = {};

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        console.log("✅ StartSession missing session_id test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ StartSession missing session_id test failed:", error.message);
        throw error;
      }
    });
  });

  describe("SessionAuth Hook - POST /whatsapp/auth", () => {
    const endpoint = "/whatsapp/auth";

    it("should get QR code with valid session_id", async () => {
      console.log("📱 Testing SessionAuth with valid session_id...");
      
      const validPayload = {
        session_id: generateValidUUID()
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(validPayload)
          .expect(200);

        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("qr");
        console.log("✅ SessionAuth valid test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SessionAuth valid test failed:", error.message);
        throw error;
      }
    });

    it("should reject auth with invalid session_id", async () => {
      console.log("🚫 Testing SessionAuth with invalid session_id...");
      
      const invalidPayload = {
        session_id: generateInvalidUUID()
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        expect(response.body.message).toContain("UUID");
        console.log("✅ SessionAuth invalid session_id test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SessionAuth invalid session_id test failed:", error.message);
        throw error;
      }
    });

    it("should reject auth with missing session_id", async () => {
      console.log("🚫 Testing SessionAuth with missing session_id...");
      
      const invalidPayload = {};

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        console.log("✅ SessionAuth missing session_id test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SessionAuth missing session_id test failed:", error.message);
        throw error;
      }
    });
  });

  describe("SendMessage Hook - POST /whatsapp/sendMessage", () => {
    const endpoint = "/whatsapp/sendMessage";

    it("should send message with valid data", async () => {
      console.log("📤 Testing SendMessage with valid data...");
      
      const validPayload = {
        session_id: generateValidUUID(),
        contact: generateValidPhone(),
        message: "Test message from integration test"
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(validPayload)
          .expect(200);

        expect(response.body).toHaveProperty("status", 200);
        expect(response.body).toHaveProperty("message", "success");
        console.log("✅ SendMessage valid test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SendMessage valid test failed:", error.message);
        throw error;
      }
    });

    it("should reject message with invalid session_id", async () => {
      console.log("🚫 Testing SendMessage with invalid session_id...");
      
      const invalidPayload = {
        session_id: generateInvalidUUID(),
        contact: generateValidPhone(),
        message: "Test message"
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        expect(response.body.message).toContain("UUID");
        console.log("✅ SendMessage invalid session_id test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SendMessage invalid session_id test failed:", error.message);
        throw error;
      }
    });

    it("should reject message with invalid contact", async () => {
      console.log("🚫 Testing SendMessage with invalid contact...");
      
      const invalidPayload = {
        session_id: generateValidUUID(),
        contact: generateInvalidPhone(),
        message: "Test message"
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        expect(response.body.message).toContain("phone number");
        console.log("✅ SendMessage invalid contact test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SendMessage invalid contact test failed:", error.message);
        throw error;
      }
    });

    it("should reject message with empty message", async () => {
      console.log("🚫 Testing SendMessage with empty message...");
      
      const invalidPayload = {
        session_id: generateValidUUID(),
        contact: generateValidPhone(),
        message: ""
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        expect(response.body.message).toContain("empty");
        console.log("✅ SendMessage empty message test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SendMessage empty message test failed:", error.message);
        throw error;
      }
    });

    it("should reject message with missing session_id", async () => {
      console.log("🚫 Testing SendMessage with missing session_id...");
      
      const invalidPayload = {
        contact: generateValidPhone(),
        message: "Test message"
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        console.log("✅ SendMessage missing session_id test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SendMessage missing session_id test failed:", error.message);
        throw error;
      }
    });

    it("should reject message with missing contact", async () => {
      console.log("🚫 Testing SendMessage with missing contact...");
      
      const invalidPayload = {
        session_id: generateValidUUID(),
        message: "Test message"
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        console.log("✅ SendMessage missing contact test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SendMessage missing contact test failed:", error.message);
        throw error;
      }
    });

    it("should reject message with missing message", async () => {
      console.log("🚫 Testing SendMessage with missing message...");
      
      const invalidPayload = {
        session_id: generateValidUUID(),
        contact: generateValidPhone()
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(invalidPayload)
          .expect(500);

        expect(response.body).toHaveProperty("status", 500);
        console.log("✅ SendMessage missing message test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ SendMessage missing message test failed:", error.message);
        throw error;
      }
    });
  });

  describe("IncomingMessage Webhook - POST /api/webhooks/whatsapp", () => {
    const endpoint = "/api/webhooks/whatsapp";

    it("should process incoming message webhook", async () => {
      console.log("📨 Testing IncomingMessage webhook...");
      
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
          body: "Incoming message from integration test - " + new Date().toISOString(),
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
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .set("X-Forwarded-For", "172.18.0.4") // Simula IP do N8N
          .send(mockIncomingMessage)
          .expect(200);

        expect(response.body).toHaveProperty("status", "success");
        expect(response.body).toHaveProperty("message", "Message processed successfully");
        console.log("✅ IncomingMessage webhook test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ IncomingMessage webhook test failed:", error.message);
        throw error;
      }
    });

    it("should handle malformed incoming message", async () => {
      console.log("🚫 Testing IncomingMessage with malformed data...");
      
      const malformedMessage = {
        // Missing required fields
        id: "msg_" + Date.now(),
        // No session, event, payload, etc.
      };

      try {
        const response = await request(app.getHttpServer())
          .post(endpoint)
          .send(malformedMessage)
          .expect(400);

        console.log("✅ IncomingMessage malformed data test passed:", response.body);
        
      } catch (error: any) {
        console.error("❌ IncomingMessage malformed data test failed:", error.message);
        throw error;
      }
    });
  });

  describe("Integration Flow Tests", () => {
    it("should complete full session lifecycle", async () => {
      console.log("🔄 Testing complete session lifecycle...");
      
      const sessionId = generateValidUUID();
      const tenantId = generateValidUUID();
      
      try {
        // 1. Create session
        console.log("1️⃣ Creating session...");
        const createResponse = await request(app.getHttpServer())
          .post("/whatsapp/sessions")
          .send({ session_id: sessionId, tenant_id: tenantId })
          .expect(200);
        
        expect(createResponse.body.status).toBe(200);
        console.log("✅ Session created");
        
        // 2. Get QR code
        console.log("2️⃣ Getting QR code...");
        const authResponse = await request(app.getHttpServer())
          .post("/whatsapp/auth")
          .send({ session_id: sessionId })
          .expect(200);
        
        expect(authResponse.body.status).toBe("success");
        expect(authResponse.body.qr).toBeDefined();
        console.log("✅ QR code obtained");
        
        // 3. Start session
        console.log("3️⃣ Starting session...");
        const startResponse = await request(app.getHttpServer())
          .post("/whatsapp/session/start")
          .send({ session_id: sessionId })
          .expect(200);
        
        expect(startResponse.body.status).toBe(200);
        console.log("✅ Session started");
        
        // 4. Send message
        console.log("4️⃣ Sending message...");
        const messageResponse = await request(app.getHttpServer())
          .post("/whatsapp/sendMessage")
          .send({ 
            session_id: sessionId, 
            contact: generateValidPhone(), 
            message: "Lifecycle test message" 
          })
          .expect(200);
        
        expect(messageResponse.body.status).toBe(200);
        console.log("✅ Message sent");
        
        console.log("🎉 Complete session lifecycle test passed!");
        
      } catch (error: any) {
        console.error("❌ Complete session lifecycle test failed:", error.message);
        throw error;
      }
    });
  });
});
