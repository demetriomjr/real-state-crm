import { Test, TestingModule } from '@nestjs/testing';
import { BusinessController } from '../../src/Application/Controllers/business.controller';
import { BusinessService } from '../../src/Application/Services/business.service';
import { AuthorizationService } from '../../src/Application/Services/authorization.service';
import { BusinessCreateDto, BusinessUpdateDto, BusinessResponseDto, BusinessCreateResponseDto } from '../../src/Application/DTOs';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('BusinessController (Unit)', () => {
  let controller: BusinessController;
  let service: BusinessService;

  const mockBusinessService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BusinessController],
      providers: [
        {
          provide: BusinessService,
          useValue: mockBusinessService,
        },
        {
          provide: AuthorizationService,
          useValue: {
            createToken: jest.fn(),
            validateToken: jest.fn(),
            refreshToken: jest.fn(),
            logout: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<BusinessController>(BusinessController);
    service = module.get<BusinessService>(BusinessService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated list of businesses', async () => {
      const mockResponse = {
        businesses: [
          { company_name: 'Business 1', subscription: 1 },
          { company_name: 'Business 2', subscription: 2 },
        ],
        total: 2,
        page: 1,
        limit: 10,
      };

      mockBusinessService.findAll.mockResolvedValue(mockResponse);

      const mockRequest = { userLevel: 10, tenantId: 'test-tenant' }; // Developer level
      const result = await controller.findAll(1, 10, mockRequest);

      expect(service.findAll).toHaveBeenCalledWith(1, 10, 10);
      expect(result).toEqual(mockResponse);
    });

    it('should use default pagination values', async () => {
      const mockResponse = {
        businesses: [],
        total: 0,
        page: 1,
        limit: 10,
      };

      mockBusinessService.findAll.mockResolvedValue(mockResponse);

      const mockRequest = { userLevel: 10, tenantId: 'test-tenant' }; // Developer level
      await controller.findAll(1, 10, mockRequest);

      expect(service.findAll).toHaveBeenCalledWith(1, 10, 10);
    });
  });

  describe('findOne', () => {
    it('should return a business by id', async () => {
      const businessId = '1';
      const mockBusiness = {
        company_name: 'Test Business',
        subscription: 1,
        subscription_level: 'Basic',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBusinessService.findOne.mockResolvedValue(mockBusiness);

      const mockRequest = { userLevel: 10, tenantId: businessId }; // Admin level
      const result = await controller.findOne(businessId, mockRequest);

      expect(service.findOne).toHaveBeenCalledWith(businessId);
      expect(result).toEqual(mockBusiness);
    });

    it('should throw NotFoundException when business not found', async () => {
      const businessId = '999';

      mockBusinessService.findOne.mockRejectedValue(new NotFoundException('Business not found'));

      const mockRequest = { userLevel: 10, tenantId: businessId }; // Admin level
      await expect(controller.findOne(businessId, mockRequest)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(businessId);
    });
  });

  describe('create', () => {
    it('should create a new business with master user successfully', async () => {
      const createBusinessDto: BusinessCreateDto = {
        company_name: 'New Business',
        subscription: 1,
        master_user_fullName: 'John Doe',
        master_user_username: 'johndoe',
        master_user_password: 'password123',
      };

      const mockResponse: BusinessCreateResponseDto = {
        business: {
          id: 'business-1',
          company_name: 'New Business',
          subscription: 1,
          subscription_level: 'Basic',
          created_at: new Date(),
          updated_at: new Date(),
        },
        master_user: {
          id: '1',
          fullName: 'John Doe',
          username: 'johndoe',
          user_level: 9,
        },
        auth: {
          token: 'mock-jwt-token',
          expires_at: new Date(),
        },
        message: 'Business and master user created successfully',
      };

      mockBusinessService.create.mockResolvedValue(mockResponse);

      const result = await controller.create(createBusinessDto);

      expect(service.create).toHaveBeenCalledWith(createBusinessDto);
      expect(result).toEqual(mockResponse);
    });

    it('should throw ConflictException when master user username already exists', async () => {
      const createBusinessDto: BusinessCreateDto = {
        company_name: 'New Business',
        subscription: 1,
        master_user_fullName: 'John Doe',
        master_user_username: 'existinguser',
        master_user_password: 'password123',
      };

      mockBusinessService.create.mockRejectedValue(
        new ConflictException('Master user username already exists'),
      );

      await expect(controller.create(createBusinessDto)).rejects.toThrow(ConflictException);
      expect(service.create).toHaveBeenCalledWith(createBusinessDto);
    });
  });

  describe('update', () => {
    it('should update a business successfully', async () => {
      const businessId = '1';
      const updateBusinessDto: BusinessUpdateDto = {
        company_name: 'Updated Business',
        subscription: 2,
      };

      const mockBusiness = {
        company_name: 'Updated Business',
        subscription: 2,
        subscription_level: 'Standard',
        created_at: new Date(),
        updated_at: new Date(),
      };

      mockBusinessService.update.mockResolvedValue(mockBusiness);

      const mockRequest = { userLevel: 9, tenantId: businessId };
      const result = await controller.update(businessId, updateBusinessDto, mockRequest);

      expect(service.update).toHaveBeenCalledWith(businessId, updateBusinessDto);
      expect(result).toEqual(mockBusiness);
    });

    it('should throw NotFoundException when business not found for update', async () => {
      const businessId = '999';
      const updateBusinessDto: BusinessUpdateDto = {
        company_name: 'Updated Business',
      };

      mockBusinessService.update.mockRejectedValue(new NotFoundException('Business not found'));

      const mockRequest = { userLevel: 9, tenantId: businessId };
      await expect(controller.update(businessId, updateBusinessDto, mockRequest)).rejects.toThrow(NotFoundException);
      expect(service.update).toHaveBeenCalledWith(businessId, updateBusinessDto);
    });
  });

  describe('remove', () => {
    it('should remove a business successfully', async () => {
      const businessId = '1';

      mockBusinessService.remove.mockResolvedValue(undefined);

      const mockRequest = { userLevel: 10, tenantId: businessId };
      const result = await controller.remove(businessId, mockRequest);

      expect(service.remove).toHaveBeenCalledWith(businessId);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when business not found for removal', async () => {
      const businessId = '999';

      mockBusinessService.remove.mockRejectedValue(new NotFoundException('Business not found'));

      const mockRequest = { userLevel: 10, tenantId: businessId };
      await expect(controller.remove(businessId, mockRequest)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(businessId);
    });
  });
});
