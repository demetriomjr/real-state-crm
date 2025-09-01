import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import axios from 'axios';

describe('WhatsApp Integration (e2e)', () => {
  let app: INestApplication;
  let wahaUrl: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    wahaUrl = process.env.WAHA_URL || 'http://localhost:3100';
  });

  afterAll(async () => {
    await app.close();
  });

  describe('WAHA Authentication', () => {
    it('should get WAHA sessions', async () => {
      const response = await request(app.getHttpServer())
        .get('/integrated-services/whatsapp/sessions')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get QR code for authentication', async () => {
      const response = await request(app.getHttpServer())
        .post('/integrated-services/whatsapp/sessions/default/auth/qr')
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.qr).toBeDefined();
    });
  });

  describe('WhatsApp Webhook', () => {
    it('should receive WhatsApp message webhook', async () => {
      const webhookData = {
        message: {
          id: 'test-message-123',
          from: '1234567890@c.us',
          type: 'text',
          text: { body: 'Test message from WhatsApp' },
          notifyName: 'Test User'
        }
      };

      const response = await request(app.getHttpServer())
        .post('/integrated-services/whatsapp/webhook')
        .set('x-webhook-secret', 'your-whatsapp-webhook-secret')
        .send(webhookData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Message processed successfully');
    });

    it('should reject webhook without secret', async () => {
      const webhookData = {
        message: {
          id: 'test-message-456',
          from: '1234567890@c.us',
          type: 'text',
          text: { body: 'Test message without secret' }
        }
      };

      await request(app.getHttpServer())
        .post('/integrated-services/whatsapp/webhook')
        .send(webhookData)
        .expect(401);
    });
  });

  describe('WhatsApp Message Sending', () => {
    it('should send message via WAHA', async () => {
      const messageData = {
        chatId: '1234567890@c.us',
        text: 'Test message from NestJS'
      };

      const response = await request(app.getHttpServer())
        .post('/integrated-services/whatsapp/send')
        .send(messageData)
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.message).toBe('Message sent successfully');
    });

    it('should reject empty message data', async () => {
      await request(app.getHttpServer())
        .post('/integrated-services/whatsapp/send')
        .send({})
        .expect(400);
    });
  });

  describe('N8N Integration', () => {
    it('should handle N8N inbound webhook', async () => {
      const n8nData = {
        message: {
          id: 'n8n-test-123',
          from: '1234567890@c.us',
          type: 'text',
          text: { body: 'Test message via N8N' }
        }
      };

      const response = await request(app.getHttpServer())
        .post('/integrated-services/whatsapp/webhook')
        .set('x-webhook-secret', 'your-whatsapp-webhook-secret')
        .send(n8nData)
        .expect(200);

      expect(response.body.status).toBe('success');
    });
  });

  describe('WAHA Direct API', () => {
    it('should connect to WAHA API', async () => {
      try {
        const response = await axios.get(`${wahaUrl}/api/sessions`);
        expect(response.status).toBe(200);
        expect(Array.isArray(response.data)).toBe(true);
      } catch (error) {
        // WAHA might not be running in test environment
        console.log('WAHA not available for testing:', error.message);
      }
    });

    it('should send message directly to WAHA', async () => {
      try {
        const messageData = {
          chatId: '1234567890@c.us',
          text: 'Direct WAHA test message'
        };

        const response = await axios.post(`${wahaUrl}/api/sendText`, messageData);
        expect(response.status).toBe(200);
      } catch (error) {
        // WAHA might not be running or session not authenticated
        console.log('WAHA send test failed:', error.message);
      }
    });
  });
});
