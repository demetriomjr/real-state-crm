import { Injectable, Logger } from "@nestjs/common";
import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";

@Injectable()
export class LeadService {
  private readonly logger = new Logger(LeadService.name);

  constructor(private readonly prisma: MainDatabaseContext) {}

  /**
   * Creates a new lead with associated person data
   */
  async createLead(
    leadData: any,
    personData: any,
    userId?: string,
  ): Promise<any> {
    this.logger.log(`Creating new lead for person: ${personData.name}`);

    // Create person first
    const person = await this.prisma.person.create({
      data: {
        ...personData,
        created_by: userId,
        updated_by: userId,
      },
    });

    // Create lead
    const lead = await this.prisma.lead.create({
      data: {
        ...leadData,
        person_id: person.id,
        created_by: userId,
        updated_by: userId,
      },
      include: {
        person: true,
      },
    });

    // Handle addresses if provided
    if (personData.addresses && personData.addresses.length > 0) {
      await this.createAddresses(person.id, personData.addresses, userId);
    }

    // Handle contacts if provided
    if (personData.contacts && personData.contacts.length > 0) {
      await this.createContacts(person.id, personData.contacts, userId);
    }

    // Handle documents if provided
    if (personData.documents && personData.documents.length > 0) {
      await this.createDocuments(person.id, personData.documents, userId);
    }

    return lead;
  }

  /**
   * Updates an existing lead
   */
  async updateLead(
    leadId: string,
    leadData: any,
    personData: any,
    userId?: string,
  ): Promise<any> {
    this.logger.log(`Updating lead: ${leadId}`);

    // Update lead
    const lead = await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        ...leadData,
        updated_by: userId,
      },
      include: {
        person: true,
      },
    });

    // Update person data
    if (personData) {
      await this.prisma.person.update({
        where: { id: lead.person_id },
        data: {
          ...personData,
          updated_by: userId,
        },
      });
    }

    // Handle address updates if provided
    if (personData?.addresses) {
      await this.updateAddresses(lead.person_id, personData.addresses, userId);
    }

    // Handle contact updates if provided
    if (personData?.contacts) {
      await this.updateContacts(lead.person_id, personData.contacts, userId);
    }

    // Handle document updates if provided
    if (personData?.documents) {
      await this.updateDocuments(lead.person_id, personData.documents, userId);
    }

    return lead;
  }

  /**
   * Gets a lead by ID with all related data
   */
  async getLeadById(leadId: string): Promise<any> {
    this.logger.log(`Getting lead by ID: ${leadId}`);

    return await this.prisma.lead.findUnique({
      where: { id: leadId },
      include: {
        person: {
          include: {
            addresses: {
              where: { deleted_at: null },
            },
            contacts: {
              where: { deleted_at: null },
            },
            documents: {
              where: { deleted_at: null },
            },
          },
        },
      },
    });
  }

  /**
   * Gets all leads with pagination
   */
  async getAllLeads(page: number = 1, limit: number = 10): Promise<any> {
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
                where: { deleted_at: null },
              },
              contacts: {
                where: { deleted_at: null },
              },
              documents: {
                where: { deleted_at: null },
              },
            },
          },
        },
        where: { deleted_at: null },
      }),
      this.prisma.lead.count({
        where: { deleted_at: null },
      }),
    ]);

    return {
      leads,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Deletes a lead (soft delete)
   */
  async deleteLead(leadId: string, userId?: string): Promise<void> {
    this.logger.log(`Deleting lead: ${leadId}`);

    await this.prisma.lead.update({
      where: { id: leadId },
      data: {
        deleted_at: new Date(),
        deleted_by: userId,
      },
    });
  }

  // Address management methods
  async handleAddressPrimaryFlag(
    personId: string,
    isPrimary?: boolean,
  ): Promise<boolean> {
    this.logger.log(`Handling address primary flag for person: ${personId}`);

    const existingAddresses = await this.prisma.address.count({
      where: {
        person_id: personId,
        deleted_at: null,
      },
    });

    if (existingAddresses === 0) {
      this.logger.log(
        `First address for person ${personId}, setting as primary`,
      );
      return true;
    }

    if (isPrimary === true) {
      await this.prisma.address.updateMany({
        where: {
          person_id: personId,
          deleted_at: null,
        },
        data: {},
      });
      this.logger.log(`Unset other primary addresses for person ${personId}`);
      return true;
    }

    return false;
  }

  async createAddresses(
    personId: string,
    addresses: any[],
    userId?: string,
  ): Promise<any[]> {
    this.logger.log(
      `Creating ${addresses.length} addresses for person: ${personId}`,
    );

    const createdAddresses = [];

    for (const address of addresses) {
      await this.handleAddressPrimaryFlag(personId);

      const createdAddress = await this.prisma.address.create({
        data: {
          ...address,
          person_id: personId,
          created_by: userId,
          updated_by: userId,
        },
      });

      createdAddresses.push(createdAddress);
    }

    return createdAddresses;
  }

  async updateAddresses(
    personId: string,
    addresses: any[],
    userId?: string,
  ): Promise<any[]> {
    this.logger.log(`Updating addresses for person: ${personId}`);

    const updatedAddresses = [];

    for (const address of addresses) {
      if (address.id) {
        if (address.is_default) {
          await this.handleAddressPrimaryFlag(personId, true);
        }

        const updatedAddress = await this.prisma.address.update({
          where: { id: address.id },
          data: {
            ...address,
            updated_by: userId,
          },
        });

        updatedAddresses.push(updatedAddress);
      } else {
        await this.handleAddressPrimaryFlag(personId);

        const createdAddress = await this.prisma.address.create({
          data: {
            ...address,
            person_id: personId,
            created_by: userId,
            updated_by: userId,
          },
        });

        updatedAddresses.push(createdAddress);
      }
    }

    return updatedAddresses;
  }

  // Contact management methods
  async handleContactPrimaryFlag(
    personId: string,
    isPrimary?: boolean,
  ): Promise<boolean> {
    this.logger.log(`Handling contact primary flag for person: ${personId}`);

    const existingContacts = await this.prisma.contact.count({
      where: {
        person_id: personId,
        deleted_at: null,
      },
    });

    if (existingContacts === 0) {
      this.logger.log(
        `First contact for person ${personId}, setting as primary`,
      );
      return true;
    }

    if (isPrimary === true) {
      await this.prisma.contact.updateMany({
        where: {
          person_id: personId,
          deleted_at: null,
        },
        data: {},
      });
      this.logger.log(`Unset other primary contacts for person ${personId}`);
      return true;
    }

    return false;
  }

  async createContacts(
    personId: string,
    contacts: any[],
    userId?: string,
  ): Promise<any[]> {
    this.logger.log(
      `Creating ${contacts.length} contacts for person: ${personId}`,
    );

    const createdContacts = [];

    for (const contact of contacts) {
      await this.handleContactPrimaryFlag(personId);

      const createdContact = await this.prisma.contact.create({
        data: {
          ...contact,
          person_id: personId,
          created_by: userId,
          updated_by: userId,
        },
      });

      createdContacts.push(createdContact);
    }

    return createdContacts;
  }

  async updateContacts(
    personId: string,
    contacts: any[],
    userId?: string,
  ): Promise<any[]> {
    this.logger.log(`Updating contacts for person: ${personId}`);

    const updatedContacts = [];

    for (const contact of contacts) {
      if (contact.id) {
        if (contact.is_default) {
          await this.handleContactPrimaryFlag(personId, true);
        }

        const updatedContact = await this.prisma.contact.update({
          where: { id: contact.id },
          data: {
            ...contact,
            updated_by: userId,
          },
        });

        updatedContacts.push(updatedContact);
      } else {
        await this.handleContactPrimaryFlag(personId);

        const createdContact = await this.prisma.contact.create({
          data: {
            ...contact,
            person_id: personId,
            created_by: userId,
            updated_by: userId,
          },
        });

        updatedContacts.push(createdContact);
      }
    }

    return updatedContacts;
  }

  // Document management methods
  async handleDocumentPrimaryFlag(
    personId: string,
    isPrimary?: boolean,
  ): Promise<boolean> {
    this.logger.log(`Handling document primary flag for person: ${personId}`);

    const existingDocuments = await this.prisma.document.count({
      where: {
        person_id: personId,
        deleted_at: null,
      },
    });

    if (existingDocuments === 0) {
      this.logger.log(
        `First document for person ${personId}, setting as primary`,
      );
      return true;
    }

    if (isPrimary === true) {
      await this.prisma.document.updateMany({
        where: {
          person_id: personId,
          deleted_at: null,
        },
        data: {},
      });
      this.logger.log(`Unset other primary documents for person ${personId}`);
      return true;
    }

    return false;
  }

  async createDocuments(
    personId: string,
    documents: any[],
    userId?: string,
  ): Promise<any[]> {
    this.logger.log(
      `Creating ${documents.length} documents for person: ${personId}`,
    );

    const createdDocuments = [];

    for (const document of documents) {
      await this.handleDocumentPrimaryFlag(personId);

      const createdDocument = await this.prisma.document.create({
        data: {
          ...document,
          person_id: personId,
          created_by: userId,
          updated_by: userId,
        },
      });

      createdDocuments.push(createdDocument);
    }

    return createdDocuments;
  }

  async updateDocuments(
    personId: string,
    documents: any[],
    userId?: string,
  ): Promise<any[]> {
    this.logger.log(`Updating documents for person: ${personId}`);

    const updatedDocuments = [];

    for (const document of documents) {
      if (document.id) {
        if (document.is_default) {
          await this.handleDocumentPrimaryFlag(personId, true);
        }

        const updatedDocument = await this.prisma.document.update({
          where: { id: document.id },
          data: {
            ...document,
            updated_by: userId,
          },
        });

        updatedDocuments.push(updatedDocument);
      } else {
        await this.handleDocumentPrimaryFlag(personId);

        const createdDocument = await this.prisma.document.create({
          data: {
            ...document,
            person_id: personId,
            created_by: userId,
            updated_by: userId,
          },
        });

        updatedDocuments.push(createdDocument);
      }
    }

    return updatedDocuments;
  }
}
