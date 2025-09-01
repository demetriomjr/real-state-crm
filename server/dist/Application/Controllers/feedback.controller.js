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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FeedbackController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const feedback_service_1 = require("../Services/feedback.service");
const DTOs_1 = require("../DTOs");
const auth_guard_1 = require("../Features/auth.guard");
let FeedbackController = FeedbackController_1 = class FeedbackController {
    constructor(feedbackService) {
        this.feedbackService = feedbackService;
        this.logger = new common_1.Logger(FeedbackController_1.name);
    }
    async findAll(page = 1, limit = 10, req) {
        const userLevel = req.userLevel;
        if (userLevel < 1) {
            throw new common_1.UnauthorizedException("User level required");
        }
        return this.feedbackService.findAll(page, limit);
    }
    async findOne(id, req) {
        const userLevel = req.userLevel;
        if (userLevel < 1) {
            throw new common_1.UnauthorizedException("User level required");
        }
        return this.feedbackService.findOne(id);
    }
    async findByChatId(chatId, req) {
        const userLevel = req.userLevel;
        if (userLevel < 1) {
            throw new common_1.UnauthorizedException("User level required");
        }
        return this.feedbackService.findByChatId(chatId);
    }
    async create(createFeedbackDto, req) {
        const userLevel = req.userLevel;
        if (userLevel < 1) {
            throw new common_1.UnauthorizedException("User level required");
        }
        if (!createFeedbackDto.user_id) {
            createFeedbackDto.user_id = req.user?.id;
        }
        return this.feedbackService.create(createFeedbackDto);
    }
};
exports.FeedbackController = FeedbackController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all feedbacks with pagination" }),
    (0, swagger_1.ApiQuery)({
        name: "page",
        required: false,
        description: "Page number (default: 1)",
    }),
    (0, swagger_1.ApiQuery)({
        name: "limit",
        required: false,
        description: "Items per page (default: 10)",
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns paginated list of feedbacks",
        type: [DTOs_1.FeedbackResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Query)("page")),
    __param(1, (0, common_1.Query)("limit")),
    __param(2, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get feedback by ID" }),
    (0, swagger_1.ApiParam)({ name: "id", description: "Feedback ID (UUID)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns feedback details",
        type: DTOs_1.FeedbackResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Feedback not found" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)("chat/:chatId"),
    (0, swagger_1.ApiOperation)({ summary: "Get feedbacks for a specific chat" }),
    (0, swagger_1.ApiParam)({ name: "chatId", description: "Chat ID (UUID)" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Returns list of feedbacks for the chat",
        type: [DTOs_1.FeedbackResponseDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Chat not found" }),
    __param(0, (0, common_1.Param)("chatId")),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "findByChatId", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, swagger_1.ApiOperation)({
        summary: "Create a new feedback (AI-generated or user-prompted)",
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Feedback created successfully",
        type: DTOs_1.FeedbackResponseDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: "Validation error" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "Unauthorized" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DTOs_1.CreateFeedbackDto, Object]),
    __metadata("design:returntype", Promise)
], FeedbackController.prototype, "create", null);
exports.FeedbackController = FeedbackController = FeedbackController_1 = __decorate([
    (0, swagger_1.ApiTags)("feedback"),
    (0, common_1.Controller)("feedback"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [feedback_service_1.FeedbackService])
], FeedbackController);
//# sourceMappingURL=feedback.controller.js.map