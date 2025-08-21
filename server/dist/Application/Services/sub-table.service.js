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
var SubTableService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubTableService = void 0;
const common_1 = require("@nestjs/common");
const postgres_context_1 = require("../../Infrastructure/Database/postgres.context");
let SubTableService = SubTableService_1 = class SubTableService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(SubTableService_1.name);
    }
    async handleAddressPrimaryFlag(personId, isPrimary) {
        this.logger.log(`Handling address primary flag for person: ${personId}`);
        const existingAddresses = await this.prisma.address.count({
            where: {
                person_id: personId,
                deleted_at: null
            }
        });
        if (existingAddresses === 0) {
            this.logger.log(`First address for person ${personId}, setting as primary`);
            return true;
        }
        if (isPrimary === true) {
            await this.prisma.address.updateMany({
                where: {
                    person_id: personId,
                    is_primary: true,
                    deleted_at: null
                },
                data: {
                    is_primary: false
                }
            });
            this.logger.log(`Unset other primary addresses for person ${personId}`);
            return true;
        }
        return false;
    }
    async handleContactPrimaryFlag(personId, isPrimary) {
        this.logger.log(`Handling contact primary flag for person: ${personId}`);
        const existingContacts = await this.prisma.contact.count({
            where: {
                person_id: personId,
                deleted_at: null
            }
        });
        if (existingContacts === 0) {
            this.logger.log(`First contact for person ${personId}, setting as primary`);
            return true;
        }
        if (isPrimary === true) {
            await this.prisma.contact.updateMany({
                where: {
                    person_id: personId,
                    is_primary: true,
                    deleted_at: null
                },
                data: {
                    is_primary: false
                }
            });
            this.logger.log(`Unset other primary contacts for person ${personId}`);
            return true;
        }
        return false;
    }
    async handleDocumentPrimaryFlag(personId, isPrimary) {
        this.logger.log(`Handling document primary flag for person: ${personId}`);
        const existingDocuments = await this.prisma.document.count({
            where: {
                person_id: personId,
                deleted_at: null
            }
        });
        if (existingDocuments === 0) {
            this.logger.log(`First document for person ${personId}, setting as primary`);
            return true;
        }
        if (isPrimary === true) {
            await this.prisma.document.updateMany({
                where: {
                    person_id: personId,
                    is_primary: true,
                    deleted_at: null
                },
                data: {
                    is_primary: false
                }
            });
            this.logger.log(`Unset other primary documents for person ${personId}`);
            return true;
        }
        return false;
    }
    async createAddresses(personId, addresses, userId) {
        this.logger.log(`Creating ${addresses.length} addresses for person: ${personId}`);
        const createdAddresses = [];
        for (const address of addresses) {
            const isPrimary = await this.handleAddressPrimaryFlag(personId, address.is_primary);
            const createdAddress = await this.prisma.address.create({
                data: {
                    ...address,
                    person_id: personId,
                    is_primary: isPrimary,
                    created_by: userId,
                    updated_by: userId
                }
            });
            createdAddresses.push(createdAddress);
        }
        return createdAddresses;
    }
    async createContacts(personId, contacts, userId) {
        this.logger.log(`Creating ${contacts.length} contacts for person: ${personId}`);
        const createdContacts = [];
        for (const contact of contacts) {
            const isPrimary = await this.handleContactPrimaryFlag(personId, contact.is_primary);
            const createdContact = await this.prisma.contact.create({
                data: {
                    ...contact,
                    person_id: personId,
                    is_primary: isPrimary,
                    created_by: userId,
                    updated_by: userId
                }
            });
            createdContacts.push(createdContact);
        }
        return createdContacts;
    }
    async createDocuments(personId, documents, userId) {
        this.logger.log(`Creating ${documents.length} documents for person: ${personId}`);
        const createdDocuments = [];
        for (const document of documents) {
            const isPrimary = await this.handleDocumentPrimaryFlag(personId, document.is_primary);
            const createdDocument = await this.prisma.document.create({
                data: {
                    ...document,
                    person_id: personId,
                    is_primary: isPrimary,
                    created_by: userId,
                    updated_by: userId
                }
            });
            createdDocuments.push(createdDocument);
        }
        return createdDocuments;
    }
    async updateAddresses(personId, addresses, userId) {
        this.logger.log(`Updating addresses for person: ${personId}`);
        const updatedAddresses = [];
        for (const address of addresses) {
            if (address.id) {
                const isPrimary = address.is_primary === true ?
                    await this.handleAddressPrimaryFlag(personId, true) :
                    address.is_primary;
                const updatedAddress = await this.prisma.address.update({
                    where: { id: address.id },
                    data: {
                        ...address,
                        is_primary: isPrimary,
                        updated_by: userId
                    }
                });
                updatedAddresses.push(updatedAddress);
            }
            else {
                const isPrimary = await this.handleAddressPrimaryFlag(personId, address.is_primary);
                const createdAddress = await this.prisma.address.create({
                    data: {
                        ...address,
                        person_id: personId,
                        is_primary: isPrimary,
                        created_by: userId,
                        updated_by: userId
                    }
                });
                updatedAddresses.push(createdAddress);
            }
        }
        return updatedAddresses;
    }
    async updateContacts(personId, contacts, userId) {
        this.logger.log(`Updating contacts for person: ${personId}`);
        const updatedContacts = [];
        for (const contact of contacts) {
            if (contact.id) {
                const isPrimary = contact.is_primary === true ?
                    await this.handleContactPrimaryFlag(personId, true) :
                    contact.is_primary;
                const updatedContact = await this.prisma.contact.update({
                    where: { id: contact.id },
                    data: {
                        ...contact,
                        is_primary: isPrimary,
                        updated_by: userId
                    }
                });
                updatedContacts.push(updatedContact);
            }
            else {
                const isPrimary = await this.handleContactPrimaryFlag(personId, contact.is_primary);
                const createdContact = await this.prisma.contact.create({
                    data: {
                        ...contact,
                        person_id: personId,
                        is_primary: isPrimary,
                        created_by: userId,
                        updated_by: userId
                    }
                });
                updatedContacts.push(createdContact);
            }
        }
        return updatedContacts;
    }
    async updateDocuments(personId, documents, userId) {
        this.logger.log(`Updating documents for person: ${personId}`);
        const updatedDocuments = [];
        for (const document of documents) {
            if (document.id) {
                const isPrimary = document.is_primary === true ?
                    await this.handleDocumentPrimaryFlag(personId, true) :
                    document.is_primary;
                const updatedDocument = await this.prisma.document.update({
                    where: { id: document.id },
                    data: {
                        ...document,
                        is_primary: isPrimary,
                        updated_by: userId
                    }
                });
                updatedDocuments.push(updatedDocument);
            }
            else {
                const isPrimary = await this.handleDocumentPrimaryFlag(personId, document.is_primary);
                const createdDocument = await this.prisma.document.create({
                    data: {
                        ...document,
                        person_id: personId,
                        is_primary: isPrimary,
                        created_by: userId,
                        updated_by: userId
                    }
                });
                updatedDocuments.push(createdDocument);
            }
        }
        return updatedDocuments;
    }
};
exports.SubTableService = SubTableService;
exports.SubTableService = SubTableService = SubTableService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgres_context_1.PrismaService])
], SubTableService);
//# sourceMappingURL=sub-table.service.js.map