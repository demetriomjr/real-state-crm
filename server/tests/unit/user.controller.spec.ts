import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../../src/Application/Controllers/user.controller';
import { UserService } from '../../src/Application/Services/user.service';
import { UserValidator } from '../../src/Application/Validators/user.validator';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '../../src/Application/DTOs';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';

describe('UserController (Unit)', () => {
  let controller: UserController;
  let service: UserService;
  let validator: UserValidator;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByTenant: jest.fn(),
    findByUsername: jest.fn(),
  };

  const mockUserValidator = {
    validateCreate: jest.fn(),
    validateUpdate: jest.fn(),
  };

  const mockRequest = {
    tenantId: 'tenant1',
    user: { username: 'testuser', tenant_id: 'tenant1' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: UserValidator,
          useValue: mockUserValidator,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    validator = module.get<UserValidator>(UserValidator);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return users for the authenticated tenant', async () => {
      const mockUsers = [
        { id: '1', username: 'user1', fullName: 'User One' },
        { id: '2', username: 'user2', fullName: 'User Two' },
      ];

      mockUserService.findByTenant.mockResolvedValue(mockUsers);

      const result = await controller.findAll(1, 10, mockRequest as any);

      expect(service.findByTenant).toHaveBeenCalledWith('tenant1');
      expect(result).toEqual(mockUsers);
    });

    it('should throw UnauthorizedException when tenantId is missing', async () => {
      const requestWithoutTenant = {};

      await expect(controller.findAll(1, 10, requestWithoutTenant as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser = { id: '1', username: 'user1', fullName: 'User One' };
      const userId = '1';

      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(userId);

      expect(service.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = '999';

      mockUserService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = {
        username: 'newuser',
        fullName: 'New User',
        password: 'password123',
        user_level: 1,
      };

      const mockCreatedUser = { id: '3', ...createUserDto };

      mockUserValidator.validateCreate.mockResolvedValue(undefined);
      mockUserService.create.mockResolvedValue(mockCreatedUser);

      const result = await controller.create(createUserDto);

      expect(validator.validateCreate).toHaveBeenCalledWith(createUserDto);
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('update', () => {
    it('should update a user successfully when user belongs to tenant', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = {
        username: 'updateduser',
        fullName: 'Updated User',
      };

      const mockUser = { id: '1', username: 'updateduser', tenant_id: 'tenant1' };

      mockUserService.findByUsername.mockResolvedValue(mockUser);
      mockUserValidator.validateUpdate.mockResolvedValue(undefined);
      mockUserService.update.mockResolvedValue(mockUser);

      const result = await controller.update(userId, updateUserDto, mockRequest as any);

      expect(service.findByUsername).toHaveBeenCalledWith(updateUserDto.username);
      expect(validator.validateUpdate).toHaveBeenCalledWith(updateUserDto);
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException when tenantId is missing', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { username: 'test' };
      const requestWithoutTenant = {};

      await expect(controller.update(userId, updateUserDto, requestWithoutTenant as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user does not belong to tenant', async () => {
      const userId = '1';
      const updateUserDto: UpdateUserDto = { username: 'test' };
      const mockUser = { id: '1', username: 'test', tenant_id: 'different-tenant' };

      mockUserService.findByUsername.mockResolvedValue(mockUser);

      await expect(controller.update(userId, updateUserDto, mockRequest as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user successfully when not a master user', async () => {
      const userId = '1';
      const mockUser = { id: '1', username: 'user1', user_level: 1 };

      mockUserService.findOne.mockResolvedValue(mockUser);
      mockUserService.findByUsername.mockResolvedValue({ ...mockUser, user_level: 1 });
      mockUserService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(userId, mockRequest as any);

      expect(service.findOne).toHaveBeenCalledWith(userId);
      expect(service.findByUsername).toHaveBeenCalledWith(mockUser.username);
      expect(service.remove).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });

    it('should throw UnauthorizedException when tenantId is missing', async () => {
      const userId = '1';
      const requestWithoutTenant = {};

      await expect(controller.remove(userId, requestWithoutTenant as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const userId = '999';

      mockUserService.findOne.mockResolvedValue(null);

      await expect(controller.remove(userId, mockRequest as any)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException when trying to delete master user', async () => {
      const userId = '1';
      const mockUser = { id: '1', username: 'master', user_level: 9 };

      mockUserService.findOne.mockResolvedValue(mockUser);
      mockUserService.findByUsername.mockResolvedValue(mockUser);

      await expect(controller.remove(userId, mockRequest as any)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(service.remove).not.toHaveBeenCalled();
    });
  });
});
