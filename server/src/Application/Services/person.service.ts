import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { MainDatabaseContext } from "@/Infrastructure/Database/main-database.context";
import { PersonValidator } from "../Validators/person.validator";

export interface PersonData {
  full_name?: string;
  tenant_id?: string;
}

export interface SubEntitiesData {
  contacts?: Array<{
    contact_type: string;
    contact_value: string;
    is_default?: boolean;
  }>;
  documents?: Array<{
    document_type: string;
    document_number: string;
    is_default?: boolean;
  }>;
  addresses?: Array<{
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    is_default?: boolean;
  }>;
}

@Injectable()
export class PersonService {
  private readonly logger = new Logger(PersonService.name);

  constructor(
    private readonly prisma: MainDatabaseContext,
    private readonly personValidator: PersonValidator,
  ) {}

  async createPerson(
    personData: PersonData,
    subEntitiesData?: SubEntitiesData,
  ): Promise<any> {
    this.logger.log("Creating new person");

    // Validate person data
    this.personValidator.validateCreate(personData);

    // Validate sub-entities if provided
    if (subEntitiesData) {
      this.validateSubEntities(subEntitiesData);
    }

    // Start transaction
    const result = await this.prisma.$transaction(async (prisma) => {
      try {
        // Create person
        const person = await prisma.person.create({
          data: {
            full_name: personData.full_name,
            tenant_id: personData.tenant_id,
          },
        });

        // Create sub-entities if provided
        if (subEntitiesData) {
          await this.createSubEntities(prisma, person.id, subEntitiesData);
        }

        return person;
      } catch (error) {
        this.logger.error(`Transaction failed: ${error.message}`);
        throw new BadRequestException("Failed to create person");
      }
    });

    this.logger.log(`Person created successfully with ID: ${result.id}`);
    return result;
  }

  async updatePerson(
    personId: string,
    personData?: PersonData,
    subEntitiesData?: SubEntitiesData,
  ): Promise<void> {
    this.logger.log(`Updating person with ID: ${personId}`);

    // Validate person data if provided
    if (personData) {
      this.personValidator.validateUpdate(personData);
    }

    // Validate sub-entities if provided
    if (subEntitiesData) {
      this.validateSubEntities(subEntitiesData);
    }

    // Start transaction
    await this.prisma.$transaction(async (prisma) => {
      try {
        // Update person basic data if provided
        if (personData && personData.full_name !== undefined) {
          await prisma.person.update({
            where: { id: personId },
            data: {
              full_name: personData.full_name,
              updated_at: new Date(),
            },
          });
        }

        // Update sub-entities if provided
        if (subEntitiesData) {
          await this.updateSubEntities(prisma, personId, subEntitiesData);
        }
      } catch (error) {
        this.logger.error(`Transaction failed: ${error.message}`);
        throw new BadRequestException("Failed to update person");
      }
    });

    this.logger.log(`Person updated successfully with ID: ${personId}`);
  }

  async findPersonWithRelations(personId: string): Promise<any> {
    this.logger.log(`Fetching person with relations for ID: ${personId}`);

    const person = await this.prisma.person.findUnique({
      where: { id: personId },
      include: {
        contacts: true,
        documents: true,
        addresses: true,
      },
    });

    if (!person) {
      this.logger.warn(`Person with ID ${personId} not found`);
      return null;
    }

    return person;
  }

  private validateSubEntities(subEntitiesData: SubEntitiesData): void {
    // Validate max items for lists
    if (subEntitiesData.contacts && subEntitiesData.contacts.length > 10) {
      throw new BadRequestException("Maximum of 10 contacts allowed");
    }
    if (subEntitiesData.documents && subEntitiesData.documents.length > 10) {
      throw new BadRequestException("Maximum of 10 documents allowed");
    }
    if (subEntitiesData.addresses && subEntitiesData.addresses.length > 10) {
      throw new BadRequestException("Maximum of 10 addresses allowed");
    }
  }

  private async createSubEntities(
    prisma: any,
    personId: string,
    subEntitiesData: SubEntitiesData,
  ): Promise<void> {
    // Create contacts
    if (subEntitiesData.contacts && subEntitiesData.contacts.length > 0) {
      for (const contact of subEntitiesData.contacts) {
        await prisma.contact.create({
          data: {
            contact_type: contact.contact_type,
            contact_value: contact.contact_value,
            person_id: personId,
            is_default: contact.is_default,
          },
        });
      }
    }

    // Create documents
    if (subEntitiesData.documents && subEntitiesData.documents.length > 0) {
      for (const document of subEntitiesData.documents) {
        await prisma.document.create({
          data: {
            document_type: document.document_type,
            document_number: document.document_number,
            person_id: personId,
            is_default: document.is_default,
          },
        });
      }
    }

    // Create addresses
    if (subEntitiesData.addresses && subEntitiesData.addresses.length > 0) {
      for (const address of subEntitiesData.addresses) {
        await prisma.address.create({
          data: {
            street: address.street,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
            person_id: personId,
            is_default: address.is_default,
          },
        });
      }
    }
  }

  private async updateSubEntities(
    prisma: any,
    personId: string,
    subEntitiesData: SubEntitiesData,
  ): Promise<void> {
    // Handle contacts
    if (subEntitiesData.contacts && subEntitiesData.contacts.length > 0) {
      // Delete existing contacts for this person
      await prisma.contact.deleteMany({
        where: { person_id: personId },
      });

      // Create new contacts
      for (const contact of subEntitiesData.contacts) {
        await prisma.contact.create({
          data: {
            contact_type: contact.contact_type,
            contact_value: contact.contact_value,
            person_id: personId,
            is_default: contact.is_default,
          },
        });
      }
    }

    // Handle documents
    if (subEntitiesData.documents && subEntitiesData.documents.length > 0) {
      // Delete existing documents for this person
      await prisma.document.deleteMany({
        where: { person_id: personId },
      });

      // Create new documents
      for (const document of subEntitiesData.documents) {
        await prisma.document.create({
          data: {
            document_type: document.document_type,
            document_number: document.document_number,
            person_id: personId,
            is_default: document.is_default,
          },
        });
      }
    }

    // Handle addresses
    if (subEntitiesData.addresses && subEntitiesData.addresses.length > 0) {
      // Delete existing addresses for this person
      await prisma.address.deleteMany({
        where: { person_id: personId },
      });

      // Create new addresses
      for (const address of subEntitiesData.addresses) {
        await prisma.address.create({
          data: {
            street: address.street,
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
            person_id: personId,
            is_default: address.is_default,
          },
        });
      }
    }
  }
}
