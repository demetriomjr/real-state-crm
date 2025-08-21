import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@/Infrastructure/Database/postgres.context';

@Injectable()
export class SubTableService {
  private readonly logger = new Logger(SubTableService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Handles the cascade effect for address primary flags
   * If the person has no addresses, the first one must be primary
   * Otherwise, set is_primary to false for new addresses
   */
  async handleAddressPrimaryFlag(personId: string, isPrimary?: boolean): Promise<boolean> {
    this.logger.log(`Handling address primary flag for person: ${personId}`);

    // Check if person already has any addresses
    const existingAddresses = await this.prisma.address.count({
      where: {
        person_id: personId,
        deleted_at: null
      }
    });

    // If no existing addresses, this one must be primary
    if (existingAddresses === 0) {
      this.logger.log(`First address for person ${personId}, setting as primary`);
      return true;
    }

    // If person already has addresses and this one is marked as primary,
    // we need to unset other primary addresses
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

    // Default to false if person already has addresses
    return false;
  }

  /**
   * Handles the cascade effect for contact primary flags
   * If the person has no contacts, the first one must be primary
   * Otherwise, set is_primary to false for new contacts
   */
  async handleContactPrimaryFlag(personId: string, isPrimary?: boolean): Promise<boolean> {
    this.logger.log(`Handling contact primary flag for person: ${personId}`);

    // Check if person already has any contacts
    const existingContacts = await this.prisma.contact.count({
      where: {
        person_id: personId,
        deleted_at: null
      }
    });

    // If no existing contacts, this one must be primary
    if (existingContacts === 0) {
      this.logger.log(`First contact for person ${personId}, setting as primary`);
      return true;
    }

    // If person already has contacts and this one is marked as primary,
    // we need to unset other primary contacts
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

    // Default to false if person already has contacts
    return false;
  }

  /**
   * Handles the cascade effect for document primary flags
   * If the person has no documents, the first one must be primary
   * Otherwise, set is_primary to false for new documents
   */
  async handleDocumentPrimaryFlag(personId: string, isPrimary?: boolean): Promise<boolean> {
    this.logger.log(`Handling document primary flag for person: ${personId}`);

    // Check if person already has any documents
    const existingDocuments = await this.prisma.document.count({
      where: {
        person_id: personId,
        deleted_at: null
      }
    });

    // If no existing documents, this one must be primary
    if (existingDocuments === 0) {
      this.logger.log(`First document for person ${personId}, setting as primary`);
      return true;
    }

    // If person already has documents and this one is marked as primary,
    // we need to unset other primary documents
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

    // Default to false if person already has documents
    return false;
  }

  /**
   * Creates multiple addresses for a person with proper primary flag handling
   */
  async createAddresses(personId: string, addresses: any[], userId?: string): Promise<any[]> {
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

  /**
   * Creates multiple contacts for a person with proper primary flag handling
   */
  async createContacts(personId: string, contacts: any[], userId?: string): Promise<any[]> {
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

  /**
   * Creates multiple documents for a person with proper primary flag handling
   */
  async createDocuments(personId: string, documents: any[], userId?: string): Promise<any[]> {
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

  /**
   * Updates addresses for a person with proper primary flag handling
   */
  async updateAddresses(personId: string, addresses: any[], userId?: string): Promise<any[]> {
    this.logger.log(`Updating addresses for person: ${personId}`);

    const updatedAddresses = [];

    for (const address of addresses) {
      if (address.id) {
        // Update existing address
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
      } else {
        // Create new address
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

  /**
   * Updates contacts for a person with proper primary flag handling
   */
  async updateContacts(personId: string, contacts: any[], userId?: string): Promise<any[]> {
    this.logger.log(`Updating contacts for person: ${personId}`);

    const updatedContacts = [];

    for (const contact of contacts) {
      if (contact.id) {
        // Update existing contact
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
      } else {
        // Create new contact
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

  /**
   * Updates documents for a person with proper primary flag handling
   */
  async updateDocuments(personId: string, documents: any[], userId?: string): Promise<any[]> {
    this.logger.log(`Updating documents for person: ${personId}`);

    const updatedDocuments = [];

    for (const document of documents) {
      if (document.id) {
        // Update existing document
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
      } else {
        // Create new document
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
}
