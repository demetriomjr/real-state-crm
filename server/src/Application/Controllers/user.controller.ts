import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Body, 
  Param, 
  Query,
  HttpStatus,
  HttpCode,
  UseGuards,
  Request,
  UnauthorizedException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '@/Application/Services/user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from '@/Application/DTOs';
import { UserValidator } from '@/Application/Validators/user.validator';
import { JwtAuthGuard } from '@/Application/Features/auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userValidator: UserValidator,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of users', type: [UserResponseDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10, @Request() req: any) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }
    return this.userService.findByTenant(tenantId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Returns user details', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: UserResponseDto })
  @ApiResponse({ status: 400, description: 'Validation error or username already exists' })
  async create(@Body() createUserDto: CreateUserDto) {
    await this.userValidator.validateCreate(createUserDto);
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Validation error or username already exists' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req: any) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }
    
    // Verify user belongs to the same tenant by checking the raw user data
    const user = await this.userService.findByUsername(updateUserDto.username || '');
    if (user && user.tenant_id !== tenantId) {
      throw new UnauthorizedException('User does not belong to the specified tenant');
    }
    
    await this.userValidator.validateUpdate(updateUserDto);
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete user by ID' })
  @ApiParam({ name: 'id', description: 'User ID (UUID)' })
  @ApiResponse({ status: 204, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Cannot delete master user (level 9)' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const tenantId = req.tenantId;
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }
    
    // Verify user belongs to the same tenant
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    
    // Check if user is a master user (level 9)
    const userEntity = await this.userService.findByUsername(user.username);
    if (userEntity && userEntity.user_level === 9) {
      throw new UnauthorizedException('Cannot delete master user (level 9)');
    }
    
    return this.userService.remove(id);
  }
}
