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
var LeadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const common_1 = require("@nestjs/common");
const postgres_context_1 = require("../../Infrastructure/Database/postgres.context");
let LeadService = LeadService_1 = class LeadService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(LeadService_1.name);
    }
    async createLead(leadData, personData, userId) {
        this.logger.log(`Creating new lead for person: ${personData.name}`);
        const person = await this.prisma.person.create({
            data: {
                ...personData,
                created_by: userId,
                updated_by: userId
            }
        });
        const lead = await this.prisma.lead.create({
            data: {
                ...leadData,
                person_id: person.id,
                created_by: userId,
                updated_by: userId
            },
            include: {
                person: true
            }
        });
        if (personData.addresses && personData.addresses.length > 0) {
            await this.createAddresses(person.id, personData.addresses, userId);
        }
        if (personData.contacts && personData.contacts.length > 0) {
            await this.createContacts(person.id, personData.contacts, userId);
        }
        if (personData.documents && personData.documents.length > 0) {
            await this.createDocuments(person.id, personData.documents, userId);
        }
        return lead;
    }
    async updateLead(leadId, leadData, personData, userId) {
        this.logger.log(`Updating lead: ${leadId}`);
        const lead = await this.prisma.lead.update({
            where: { id: leadId },
            data: {
                ...leadData,
                updated_by: userId
            },
            include: {
                person: true
            }
        });
        if (personData) {
            await this.prisma.person.update({
                where: { id: lead.person_id },
                data: {
                    ...personData,
                    updated_by: userId
                }
            });
        }
        if (personData?.addresses) {
            await this.updateAddresses(lead.person_id, personData.addresses, userId);
        }
        if (personData?.contacts) {
            await this.updateContacts(lead.person_id, personData.contacts, userId);
        }
        if (personData?.documents) {
            await this.updateDocuments(lead.person_id, personData.documents, userId);
        }
        return lead;
    }
    async getLeadById(leadId) {
        this.logger.log(`Getting lead by ID: ${leadId}`);
        return await this.prisma.lead.findUnique({
            where: { id: leadId },
            include: {
                person: {
                    include: {
                        addresses: {
                            where: { deleted_at: null }
                        },
                        contacts: {
                            where: { deleted_at: null }
                        },
                        documents: {
                            where: { deleted_at: null }
                        }
                    }
                }
            }
        });
    }
    async getAllLeads(page = 1, limit = 10) {
        this.logger.log(`Getting all leads - page: ${page}, limit: ${limit}`);
        const skip = (page - 1) * limit;
        const [leads, total] = await Promise.all([
            this.prisma.lead.findMany({
                skip,
                take: limit,
                include: {
                    person: {
                        include: {
                            addresses: {
                                where: { deleted_at: null }
                            },
                            contacts: {
                                where: { deleted_at: null }
                            },
                            documents: {
                                where: { deleted_at: null }
                            }
                        }
                    }
                },
                where: { deleted_at: null }
            }),
            this.prisma.lead.count({
                where: { deleted_at: null }
            })
        ]);
        return {
            leads,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async deleteLead(leadId, userId) {
        this.logger.log(`Deleting lead: ${leadId}`);
        await this.prisma.lead.update({
            where: { id: leadId },
            data: {
                deleted_at: new Date(),
                deleted_by: userId
            }
        });
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
exports.LeadService = LeadService;
exports.LeadService = LeadService = LeadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [postgres_context_1.PrismaService])
], LeadService);
//# sourceMappingURL=lead.service.js.map