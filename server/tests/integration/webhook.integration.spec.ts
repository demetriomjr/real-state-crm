import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "@/app.module";

describe("Webhook Integration Tests", () => {
  let app: INestApplication;

  const validWebhookData = {
    id: "msg_123456789",
    timestamp: 1640995200000,
    session: "default", // Usando "default" como especificado
    event: "message",
    payload: {
      id: "msg_123456789",
      timestamp: 1640995200000,
      from: "5511999999999",
      fromMe: false,
      body: "Hello, this is a test message",
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
      id: "5511999999999@c.us",
      lid: "5511999999999@lid",
      pushName: "Test User",
    },
    environment: {
      version: "1.0.0",
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe("POST /api/webhooks/whatsapp", () => {
    it("should accept webhook without authentication when coming from Docker internal", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/webhooks/whatsapp")
        .set("X-Forwarded-For", "172.18.0.4") // Simulate n8n container IP
        .send(validWebhookData)
        .expect(200);

      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "Message processed successfully");
    });

    it("should reject webhook without proper webhook secret", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/webhooks/whatsapp")
        .set("X-Forwarded-For", "172.18.0.4")
        .set("X-Webhook-Secret", "wrong-secret")
        .send(validWebhookData)
        .expect(401);

      expect(response.body).toHaveProperty("message", "Invalid webhook secret");
    });

    it("should accept webhook with correct webhook secret", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/webhooks/whatsapp")
        .set("X-Forwarded-For", "172.18.0.4")
        .set("X-Webhook-Secret", "your-whatsapp-webhook-secret")
        .send(validWebhookData)
        .expect(200);

      expect(response.body).toHaveProperty("status", "success");
    });

    it("should ignore non-message events", async () => {
      const nonMessageWebhook = {
        ...validWebhookData,
        event: "session.status",
      };

      const response = await request(app.getHttpServer())
        .post("/api/webhooks/whatsapp")
        .set("X-Forwarded-For", "172.18.0.4")
        .send(nonMessageWebhook)
        .expect(200);

      expect(response.body).toHaveProperty("status", "success");
      expect(response.body).toHaveProperty("message", "Event ignored");
    });

    it("should reject webhook with invalid data", async () => {
      const invalidWebhook = {
        ...validWebhookData,
        session: null, // Invalid session
      };

      const response = await request(app.getHttpServer())
        .post("/api/webhooks/whatsapp")
        .set("X-Forwarded-For", "172.18.0.4")
        .send(invalidWebhook)
        .expect(400);

      expect(response.body).toHaveProperty("message", "Webhook data is required");
    });

    it("should handle webhook with media message", async () => {
      const mediaWebhook = {
        ...validWebhookData,
        payload: {
          ...validWebhookData.payload,
          hasMedia: true,
          mimetype: "image/jpeg",
        },
      };

      const response = await request(app.getHttpServer())
        .post("/api/webhooks/whatsapp")
        .set("X-Forwarded-For", "172.18.0.4")
        .send(mediaWebhook)
        .expect(200);

      expect(response.body).toHaveProperty("status", "success");
    });

    it("should handle webhook with location message", async () => {
      const locationWebhook = {
        ...validWebhookData,
        payload: {
          ...validWebhookData.payload,
          location: {
            latitude: "-23.5505",
            longitude: "-46.6333",
            description: "São Paulo, Brazil",
          },
        },
      };

      const response = await request(app.getHttpServer())
        .post("/api/webhooks/whatsapp")
        .set("X-Forwarded-For", "172.18.0.4")
        .send(locationWebhook)
        .expect(200);

      expect(response.body).toHaveProperty("status", "success");
    });

    it("should handle webhook with reply message", async () => {
      const replyWebhook = {
        ...validWebhookData,
        payload: {
          ...validWebhookData.payload,
          replyTo: {
            id: "original_msg_123",
            participant: "5511999999999@c.us",
            body: "Original message",
          },
        },
      };

      const response = await request(app.getHttpServer())
        .post("/api/webhooks/whatsapp")
        .set("X-Forwarded-For", "172.18.0.4")
        .send(replyWebhook)
        .expect(200);

      expect(response.body).toHaveProperty("status", "success");
    });
  });

  describe("Webhook Security", () => {
    it("should reject requests from non-Docker internal IPs", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/webhooks/whatsapp")
        .set("X-Forwarded-For", "192.168.1.100") // External IP
        .send(validWebhookData)
        .expect(401);

      expect(response.body).toHaveProperty("message", "Missing tenant_id or user_level");
    });

    it("should accept requests from various Docker internal IPs", async () => {
      const dockerIPs = ["172.18.0.1", "172.18.0.4", "172.18.0.5", "172.18.0.10"];

      for (const ip of dockerIPs) {
        const response = await request(app.getHttpServer())
          .post("/api/webhooks/whatsapp")
          .set("X-Forwarded-For", ip)
          .send(validWebhookData)
          .expect(200);

        expect(response.body).toHaveProperty("status", "success");
      }
    });
  });
});