import { Test, TestingModule } from '@nestjs/testing';
import { AuthorizationController } from '../../src/Application/Controllers/authorization.controller';
import { AuthorizationService } from '../../src/Application/Services/authorization.service';
import { AuthorizationRequestDto, AuthorizationResponseDto } from '../../src/Application/DTOs/Authorization';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthorizationController (Unit)', () => {
  let controller: AuthorizationController;
  let service: AuthorizationService;

  const mockAuthorizationService = {
  validateUser: jest.fn(),
  createToken: jest.fn(),
  validateToken: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
  invalidateToken: jest.fn(),
  isDevelopmentEnvironment: jest.fn(),
};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorizationController],
      providers: [
        {
          provide: AuthorizationService,
          useValue: mockAuthorizationService,
        },
      ],
    }).compile();

    controller = module.get<AuthorizationController>(AuthorizationController);
    service = module.get<AuthorizationService>(AuthorizationService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should return authentication token when valid credentials are provided', async () => {
      const authRequest: AuthorizationRequestDto = {
        username: 'testuser',
        password: 'password123',
      };

      const mockUser = {
        id: '1',
        username: 'testuser',
        tenant_id: 'tenant1',
        user_level: 1,
      };

      const mockResponse: AuthorizationResponseDto = {
        token: 'mock-jwt-token',
        expires_at: new Date(),
      };

      mockAuthorizationService.validateUser.mockResolvedValue(mockUser);
      mockAuthorizationService.createToken.mockResolvedValue(mockResponse);

      const result = await controller.login(authRequest);

      expect(service.validateUser).toHaveBeenCalledWith(
        authRequest.username,
        authRequest.password,
      );
      expect(service.createToken).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockResponse);
    });

    it('should throw UnauthorizedException when invalid credentials are provided', async () => {
      const authRequest: AuthorizationRequestDto = {
        username: 'testuser',
        password: 'wrongpassword',
      };

      mockAuthorizationService.validateUser.mockResolvedValue(null);

      await expect(controller.login(authRequest)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.validateUser).toHaveBeenCalledWith(
        authRequest.username,
        authRequest.password,
      );
    });
  });

  describe('logout', () => {
    it('should successfully logout and invalidate token', async () => {
      const token = 'mock-jwt-token';
      const authHeader = `Bearer ${token}`;
      const mockResponse = { message: 'Logout successful' };

      mockAuthorizationService.validateToken.mockResolvedValue({ username: 'testuser', tenant_id: 'tenant1' });
      mockAuthorizationService.invalidateToken.mockImplementation(() => {});

      const result = await controller.logout(authHeader);

      expect(service.validateToken).toHaveBeenCalledWith(token);
      expect(service.invalidateToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockResponse);
    });

    it('should throw UnauthorizedException for invalid authorization header', async () => {
      const invalidHeader = 'InvalidHeader';

      await expect(controller.logout(invalidHeader)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('refresh', () => {
    it('should refresh token successfully', async () => {
      const token = 'mock-jwt-token';
      const authHeader = `Bearer ${token}`;
      const mockResponse: AuthorizationResponseDto = {
        token: 'new-mock-jwt-token',
        expires_at: new Date(),
      };

      mockAuthorizationService.refreshToken.mockResolvedValue(mockResponse);

      const result = await controller.refresh(authHeader);

      expect(service.refreshToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(mockResponse);
    });

    it('should throw UnauthorizedException when refresh fails', async () => {
      const token = 'invalid-token';
      const authHeader = `Bearer ${token}`;

      mockAuthorizationService.refreshToken.mockRejectedValue(
        new UnauthorizedException('Invalid token'),
      );

      await expect(controller.refresh(authHeader)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.refreshToken).toHaveBeenCalledWith(token);
    });

    it('should throw UnauthorizedException for invalid authorization header', async () => {
      const invalidHeader = 'InvalidHeader';

      await expect(controller.refresh(invalidHeader)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
