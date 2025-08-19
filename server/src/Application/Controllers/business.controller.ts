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
  HttpCode 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { BusinessService } from '@/Application/Services/business.service';
import { BusinessCreateDto, BusinessUpdateDto, BusinessResponseDto, BusinessCreateResponseDto } from '@/Application/DTOs';

@ApiTags('businesses')
@Controller('businesses')
export class BusinessController {
  constructor(
    private readonly businessService: BusinessService,
  ) {}

  @Get()
  @ApiOperation({ 
    summary: 'Get all businesses with pagination',
    description: 'Retrieves a paginated list of all businesses. Note: This endpoint is not protected by authentication for business discovery purposes.'
  })
  @ApiQuery({ name: 'page', required: false, description: 'Page number (default: 1)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page (default: 10)' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of businesses', type: [BusinessResponseDto] })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.businessService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get business by ID',
    description: 'Retrieves business details by ID. Note: This endpoint is not protected by authentication for business discovery purposes.'
  })
  @ApiParam({ name: 'id', description: 'Business ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Returns business details', type: BusinessResponseDto })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async findOne(@Param('id') id: string) {
    return this.businessService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Create a new business with master user',
    description: 'Creates a new business and automatically creates a master user (owner) with user_level 9. The master user cannot be deleted and has full administrative privileges. Returns an authentication token for the master user.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Business and master user created successfully', 
    type: BusinessCreateResponseDto 
  })
  @ApiResponse({ status: 400, description: 'Validation error or master user username already exists' })
  @ApiResponse({ status: 409, description: 'Master user username already exists' })
  async create(@Body() createBusinessDto: BusinessCreateDto): Promise<BusinessCreateResponseDto> {
    return this.businessService.create(createBusinessDto);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update business by ID',
    description: 'Updates business information. Note: This endpoint requires authentication and proper authorization.'
  })
  @ApiParam({ name: 'id', description: 'Business ID (UUID)' })
  @ApiResponse({ status: 200, description: 'Business updated successfully', type: BusinessResponseDto })
  @ApiResponse({ status: 404, description: 'Business not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async update(@Param('id') id: string, @Body() updateBusinessDto: BusinessUpdateDto) {
    return this.businessService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ 
    summary: 'Soft delete business by ID',
    description: 'Performs a soft delete of the business. Note: This endpoint requires authentication and proper authorization.'
  })
  @ApiParam({ name: 'id', description: 'Business ID (UUID)' })
  @ApiResponse({ status: 204, description: 'Business deleted successfully' })
  @ApiResponse({ status: 404, description: 'Business not found' })
  async remove(@Param('id') id: string) {
    return this.businessService.remove(id);
  }
}
