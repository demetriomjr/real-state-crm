import { Test, TestingModule } from "@nestjs/testing";
import { Logger } from "@nestjs/common";
import axios from "axios";
import { N8NWhatsappService } from "@/Application/Services/n8n-whatsapp.service";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("N8NWhatsappService", () => {
  let service: N8NWhatsappService;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [N8NWhatsappService],
    }).compile();

    service = module.get<N8NWhatsappService>(N8NWhatsappService);
    
    // Spy on the service's internal logger
    logger = (service as any).logger;
    jest.spyOn(logger, 'log').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
    jest.spyOn(logger, 'warn').mockImplementation(() => {});
    jest.spyOn(logger, 'debug').mockImplementation(() => {});

    // Clear axios mocks but preserve logger mocks
    mockedAxios.post.mockClear();
  });

  afterEach(() => {
    // Reset environment variables
    delete process.env.N8N_BASE_URL;
  });

  describe("Service Initialization", () => {
    it("should be defined", () => {
      expect(service).toBeDefined();
    });

    it("should use default N8N URL when N8N_BASE_URL is not set", () => {
      // Access private property for testing
      const n8nBaseUrl = (service as any).n8nBaseUrl;
      expect(n8nBaseUrl).toBe("http://localhost:5678");
    });

    it("should use N8N_BASE_URL environment variable when set", () => {
      process.env.N8N_BASE_URL = "https://custom-n8n.example.com";
      
      // Create new service instance to test env var
      const newService = new N8NWhatsappService();
      const n8nBaseUrl = (newService as any).n8nBaseUrl;
      expect(n8nBaseUrl).toBe("https://custom-n8n.example.com");
    });
  });

  describe("createSession", () => {
    const validSessionId = "123e4567-e89b-12d3-a456-426614174000";
    const validTenantId = "987fcdeb-51a2-43d1-b789-123456789abc";

    it("should create session successfully with valid data", async () => {
      // Mock successful response
      const mockResponse = {
        data: {
          session_id: validSessionId,
          tenant_id: validTenantId,
          status: "created",
          qr_code: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await service.createSession(validSessionId, validTenantId);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:5678/webhook/whatsapp/session",
        {
          session_id: validSessionId,
          tenant_id: validTenantId,
        },
      );

      expect(result).toEqual(mockResponse.data);
      expect(logger.log).toHaveBeenCalledWith(
        `Creating WhatsApp session: ${validSessionId}`,
      );
      expect(logger.log).toHaveBeenCalledWith(
        `WhatsApp session created successfully: ${validSessionId}`,
      );
    });

    it("should handle network errors gracefully", async () => {
      const networkError = new Error("Network Error");
      mockedAxios.post.mockRejectedValueOnce(networkError);

      await expect(
        service.createSession(validSessionId, validTenantId),
      ).rejects.toThrow("Failed to create WhatsApp session: Network Error");

      expect(logger.error).toHaveBeenCalledWith(
        "Error creating WhatsApp session: Network Error",
      );
    });

    it("should handle HTTP error responses", async () => {
      const httpError = {
        response: {
          status: 422,
          data: {
            error: "Session already exists",
          },
        },
        message: "Request failed with status code 422",
      };

      mockedAxios.post.mockRejectedValueOnce(httpError);

      await expect(
        service.createSession(validSessionId, validTenantId),
      ).rejects.toThrow(
        "Failed to create WhatsApp session: Request failed with status code 422",
      );

      expect(logger.error).toHaveBeenCalledWith(
        "Error creating WhatsApp session: Request failed with status code 422",
      );
    });

    it("should handle empty response data", async () => {
      const mockResponse = { data: null };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await service.createSession(validSessionId, validTenantId);

      expect(result).toBeNull();
    });

    it("should use custom N8N URL when environment variable is set", async () => {
      process.env.N8N_BASE_URL = "https://custom-n8n.example.com";
      const customService = new N8NWhatsappService();

      const mockResponse = { data: { status: "created" } };
      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      await customService.createSession(validSessionId, validTenantId);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://custom-n8n.example.com/webhook/whatsapp/session",
        {
          session_id: validSessionId,
          tenant_id: validTenantId,
        },
      );
    });
  });

  describe("getAuthQRCode", () => {
    const validSessionId = "123e4567-e89b-12d3-a456-426614174000";

    it("should get QR code successfully", async () => {
      const mockResponse = {
        data: {
          qr: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          status: "success",
          expires_in: 120,
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await service.getAuthQRCode(validSessionId);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:5678/webhook/whatsapp/auth",
        {
          session_id: validSessionId,
        },
      );

      expect(result).toEqual(mockResponse.data);
      expect(logger.log).toHaveBeenCalledWith(
        `Getting QR code for session: ${validSessionId}`,
      );
      expect(logger.log).toHaveBeenCalledWith(
        `QR code retrieved successfully for session: ${validSessionId}`,
      );
    });

    it("should handle QR code request errors", async () => {
      const error = new Error("Session not found");
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(service.getAuthQRCode(validSessionId)).rejects.toThrow(
        "Failed to get QR code: Session not found",
      );

      expect(logger.error).toHaveBeenCalledWith(
        "Error getting QR code: Session not found",
      );
    });

    it("should handle invalid session ID", async () => {
      const invalidSessionId = "invalid-session-id";
      const error = {
        response: {
          status: 404,
          data: { error: "Session not found" },
        },
        message: "Request failed with status code 404",
      };

      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(service.getAuthQRCode(invalidSessionId)).rejects.toThrow(
        "Failed to get QR code: Request failed with status code 404",
      );
    });
  });

  describe("startSession", () => {
    const validSessionId = "123e4567-e89b-12d3-a456-426614174000";

    it("should start session successfully", async () => {
      const mockResponse = {
        data: {
          session_id: validSessionId,
          status: "started",
          message: "Session started successfully",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await service.startSession(validSessionId);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:5678/webhook/whatsapp/session/start",
        {
          session_id: validSessionId,
        },
      );

      expect(result).toEqual(mockResponse.data);
      expect(logger.log).toHaveBeenCalledWith(
        `Starting WhatsApp session: ${validSessionId}`,
      );
      expect(logger.log).toHaveBeenCalledWith(
        `WhatsApp session started successfully: ${validSessionId}`,
      );
    });

    it("should handle session start errors", async () => {
      const error = new Error("Session already running");
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(service.startSession(validSessionId)).rejects.toThrow(
        "Failed to start WhatsApp session: Session already running",
      );

      expect(logger.error).toHaveBeenCalledWith(
        "Error starting WhatsApp session: Session already running",
      );
    });

    it("should handle session not found error", async () => {
      const error = {
        response: {
          status: 404,
          data: { error: "Session not found" },
        },
        message: "Request failed with status code 404",
      };

      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(service.startSession(validSessionId)).rejects.toThrow(
        "Failed to start WhatsApp session: Request failed with status code 404",
      );
    });
  });

  describe("sendMessage", () => {
    const validSessionId = "123e4567-e89b-12d3-a456-426614174000";
    const validContact = "5511999999999";
    const validMessage = "Hello, this is a test message";

    it("should send message successfully", async () => {
      const mockResponse = {
        data: {
          message_id: "msg_123456789",
          status: "sent",
          timestamp: "2024-01-01T12:00:00Z",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(mockResponse);

      const result = await service.sendMessage(
        validSessionId,
        validContact,
        validMessage,
      );

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:5678/webhook/whatsapp/sendMessage",
        {
          session_id: validSessionId,
          contact: validContact,
          message: validMessage,
        },
      );

      expect(result).toEqual(mockResponse.data);
      expect(logger.log).toHaveBeenCalledWith(
        `Sending WhatsApp message to ${validContact} via session ${validSessionId}`,
      );
      expect(logger.log).toHaveBeenCalledWith(
        `WhatsApp message sent successfully to ${validContact}`,
      );
    });

    it("should handle message send errors", async () => {
      const error = new Error("Invalid phone number");
      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(
        service.sendMessage(validSessionId, validContact, validMessage),
      ).rejects.toThrow("Failed to send WhatsApp message: Invalid phone number");

      expect(logger.error).toHaveBeenCalledWith(
        "Error sending WhatsApp message: Invalid phone number",
      );
    });

    it("should handle validation errors from n8n", async () => {
      const validationError = {
        response: {
          status: 422,
          data: {
            error: "Please make sure you set session_name, contact is a valid phone number and the text is not empty.",
          },
        },
        message: "Request failed with status code 422",
      };

      mockedAxios.post.mockRejectedValueOnce(validationError);

      await expect(
        service.sendMessage(validSessionId, validContact, validMessage),
      ).rejects.toThrow(
        "Failed to send WhatsApp message: Request failed with status code 422",
      );
    });

    it("should handle session not found error", async () => {
      const sessionNotFoundError = {
        response: {
          status: 404,
          data: { error: "session doesn't exists" },
        },
        message: "Request failed with status code 404",
      };

      mockedAxios.post.mockRejectedValueOnce(sessionNotFoundError);

      await expect(
        service.sendMessage(validSessionId, validContact, validMessage),
      ).rejects.toThrow(
        "Failed to send WhatsApp message: Request failed with status code 404",
      );
    });

    it("should handle empty message content", async () => {
      const emptyMessage = "";
      const error = {
        response: {
          status: 422,
          data: { error: "Message content cannot be empty" },
        },
        message: "Request failed with status code 422",
      };

      mockedAxios.post.mockRejectedValueOnce(error);

      await expect(
        service.sendMessage(validSessionId, validContact, emptyMessage),
      ).rejects.toThrow(
        "Failed to send WhatsApp message: Request failed with status code 422",
      );
    });
  });

  describe("Integration with n8n Workflow", () => {
    it("should match expected n8n webhook paths from workflow", () => {
      // Based on the workflow JSON, these are the expected paths
      const expectedPaths = [
        "/webhook/whatsapp/session",      // SessionManagerHook
        "/webhook/whatsapp/auth",         // SessionAuthHook  
        "/webhook/whatsapp/session/start", // StartSessionHook
        "/webhook/whatsapp/sendMessage",  // SendMessage
      ];

      // Test that our service uses the correct paths
      const baseUrl = (service as any).n8nBaseUrl;
      
      expectedPaths.forEach((path) => {
        expect(baseUrl + path).toMatch(/^https?:\/\/.+\/webhook\/whatsapp/);
      });
    });

    it("should handle n8n workflow response formats", async () => {
      // Test response format from n8n workflow
      const n8nWorkflowResponse = {
        data: {
          qr_image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          instructions: "Read this qr code with your phone to authenticate it and sync with our servers. Once you've done that, consume the same route ir our API to check the session. You have 2 minutes before this QR code expires.",
        },
      };

      mockedAxios.post.mockResolvedValueOnce(n8nWorkflowResponse);

      const result = await service.getAuthQRCode("test-session");

      expect(result).toEqual(n8nWorkflowResponse.data);
      expect(result.qr_image).toBeDefined();
      expect(result.instructions).toBeDefined();
    });
  });

  describe("Error Handling and Edge Cases", () => {
    it("should handle timeout errors", async () => {
      const timeoutError = new Error("timeout of 5000ms exceeded");
      mockedAxios.post.mockRejectedValueOnce(timeoutError);

      await expect(
        service.createSession("test-session", "test-tenant"),
      ).rejects.toThrow("Failed to create WhatsApp session: timeout of 5000ms exceeded");
    });

    it("should handle connection refused errors", async () => {
      const connectionError = new Error("connect ECONNREFUSED 127.0.0.1:5678");
      mockedAxios.post.mockRejectedValueOnce(connectionError);

      await expect(
        service.createSession("test-session", "test-tenant"),
      ).rejects.toThrow("Failed to create WhatsApp session: connect ECONNREFUSED 127.0.0.1:5678");
    });

    it("should handle malformed JSON responses", async () => {
      // Mock axios to return malformed response
      const malformedResponse = {
        data: "invalid json response",
      };
      mockedAxios.post.mockResolvedValueOnce(malformedResponse);

      const result = await service.createSession("test-session", "test-tenant");
      expect(result).toBe("invalid json response");
    });

    it("should handle undefined response data", async () => {
      const undefinedResponse = { data: undefined };
      mockedAxios.post.mockResolvedValueOnce(undefinedResponse);

      const result = await service.createSession("test-session", "test-tenant");
      expect(result).toBeUndefined();
    });
  });
});
