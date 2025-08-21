"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var BusinessService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessService = void 0;
const common_1 = require("@nestjs/common");
const business_repository_1 = require("../../Infrastructure/Repositories/business.repository");
const user_repository_1 = require("../../Infrastructure/Repositories/user.repository");
const Business_1 = require("../../Domain/Business/Business");
const authorization_service_1 = require("./authorization.service");
const bcrypt = require("bcryptjs");
let BusinessService = BusinessService_1 = class BusinessService {
    constructor(businessRepository, userRepository, authorizationService) {
        this.businessRepository = businessRepository;
        this.userRepository = userRepository;
        this.authorizationService = authorizationService;
        this.logger = new common_1.Logger(BusinessService_1.name);
    }
    get prisma() {
        return this.businessRepository['prisma'];
    }
    async findAll(page = 1, limit = 10, userLevel) {
        this.logger.log(`Fetching businesses with pagination: page=${page}, limit=${limit}`);
        if (userLevel !== undefined && userLevel < 10) {
            this.logger.warn(`User with level ${userLevel} attempted to access findAll - access denied`);
            throw new common_1.BadRequestException('Access denied. Developer level (10) required to view all businesses.');
        }
        const result = await this.businessRepository.findAll(page, limit);
        return {
            businesses: result.businesses.map(business => this.mapToResponseDto(business)),
            total: result.total,
            page,
            limit,
        };
    }
    async findOne(id) {
        this.logger.log(`Fetching business with ID: ${id}`);
        const business = await this.businessRepository.findOne(id);
        if (!business) {
            this.logger.warn(`Business with ID ${id} not found`);
            throw new common_1.NotFoundException(`Business with ID ${id} not found`);
        }
        return this.mapToResponseDto(business);
    }
    async create(createBusinessDto) {
        this.logger.log(`Creating new business: ${createBusinessDto.company_name}`);
        const existingUser = await this.userRepository.findByUsername(createBusinessDto.master_user_username);
        if (existingUser) {
            this.logger.warn(`Master user username already exists: ${createBusinessDto.master_user_username}`);
            throw new common_1.ConflictException('Master user username already exists');
        }
        const result = await this.prisma.$transaction(async (prisma) => {
            try {
                const business = await prisma.business.create({
                    data: {
                        company_name: createBusinessDto.company_name,
                        subscription: createBusinessDto.subscription || 1,
                    },
                });
                const hashedPassword = await bcrypt.hash(createBusinessDto.master_user_password, 10);
                const masterUser = await prisma.user.create({
                    data: {
                        fullName: createBusinessDto.master_user_fullName,
                        username: createBusinessDto.master_user_username,
                        password: hashedPassword,
                        user_level: 9,
                        tenant_id: business.id,
                    },
                });
                return { business: new Business_1.Business(business), masterUser };
            }
            catch (error) {
                this.logger.error(`Transaction failed: ${error.message}`);
                throw new common_1.BadRequestException('Failed to create business and master user');
            }
        });
        const authToken = await this.authorizationService.createToken(result.masterUser);
        this.logger.log(`Business created successfully: ${result.business.company_name} with master user: ${result.masterUser.username}`);
        return authToken;
    }
    async update(id, updateBusinessDto) {
        this.logger.log(`Updating business with ID: ${id}`);
        const existingBusiness = await this.businessRepository.findOne(id);
        if (!existingBusiness) {
            this.logger.warn(`Business with ID ${id} not found for update`);
            throw new common_1.NotFoundException(`Business with ID ${id} not found`);
        }
        const business = await this.businessRepository.update(id, updateBusinessDto);
        this.logger.log(`Business updated successfully with ID: ${business.id}`);
        return this.mapToResponseDto(business);
    }
    async remove(id) {
        this.logger.log(`Removing business with ID: ${id}`);
        const existingBusiness = await this.businessRepository.findOne(id);
        if (!existingBusiness) {
            this.logger.warn(`Business with ID ${id} not found for removal`);
            throw new common_1.NotFoundException(`Business with ID ${id} not found`);
        }
        await this.businessRepository.remove(id);
        this.logger.log(`Business removed successfully with ID: ${id}`);
    }
    async validateTenantId(tenantId) {
        this.logger.log(`Validating tenant ID: ${tenantId}`);
        return await this.businessRepository.validateTenantId(tenantId);
    }
    async purge(id) {
        this.logger.warn(`PURGING business with ID: ${id} - PERMANENT DELETION`);
        const existingBusiness = await this.businessRepository.findOne(id);
        if (!existingBusiness) {
            this.logger.warn(`Business with ID ${id} not found for purge`);
            throw new common_1.NotFoundException(`Business with ID ${id} not found`);
        }
        const tenantId = existingBusiness.id;
        await this.prisma.$transaction(async (prisma) => {
            const users = await this.userRepository.findByTenant(tenantId);
            for (const user of users) {
                await this.userRepository.purgeUserRoles(user.id);
            }
            await this.userRepository.purgeByTenant(tenantId);
            await this.businessRepository.purge(id);
        });
        this.logger.warn(`Business PURGED permanently with ID: ${id} and tenant: ${tenantId}`);
    }
    mapToResponseDto(business) {
        return {
            company_name: business.company_name,
            subscription: business.subscription,
            subscription_level: business.getSubscriptionLevel(),
            created_at: business.created_at,
            created_by: business.created_by,
            updated_at: business.updated_at,
            updated_by: business.updated_by,
            deleted_at: business.deleted_at,
            deleted_by: business.deleted_by,
        };
    }
};
exports.BusinessService = BusinessService;
exports.BusinessService = BusinessService = BusinessService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [business_repository_1.BusinessRepository,
        user_repository_1.UserRepository,
        authorization_service_1.AuthorizationService])
], BusinessService);
//# sourceMappingURL=business.service.js.map