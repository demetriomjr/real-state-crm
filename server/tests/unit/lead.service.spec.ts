import { Test, TestingModule } from '@nestjs/testing';
import { LeadService } from '../../src/Application/Services/lead.service';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';

describe('LeadService', () => {
  let service: LeadService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    person: {
      create: jest.fn(),
      update: jest.fn(),
    },
    lead: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    address: {
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    contact: {
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
    document: {
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<LeadService>(LeadService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLead', () => {
    it('should create a lead with person data successfully', async () => {
      const leadData = {
        lead_type: 'customer',
        lead_status: 'new',
        lead_temperature: 'warm',
        lead_origin: 'website',
        lead_description: 'Test lead',
        lead_notes: ['Note 1'],
        first_contacted_by: 'user-123',
      };

      const personData = {
        full_name: 'John Doe',
        document_type: 'cpf',
        document_number: '12345678901',
        addresses: [],
        contacts: [],
        documents: [],
      };

      const mockPerson = {
        id: 'person-123',
        ...personData,
      };

      const mockLead = {
        id: 'lead-123',
        person_id: mockPerson.id,
        ...leadData,
        person: mockPerson,
      };

      mockPrismaService.person.create.mockResolvedValue(mockPerson);
      mockPrismaService.lead.create.mockResolvedValue(mockLead);

      const result = await service.createLead(leadData, personData, 'user-123');

      expect(mockPrismaService.person.create).toHaveBeenCalledWith({
        data: {
          ...personData,
          created_by: 'user-123',
          updated_by: 'user-123',
        },
      });

      expect(mockPrismaService.lead.create).toHaveBeenCalledWith({
        data: {
          ...leadData,
          person_id: mockPerson.id,
          created_by: 'user-123',
          updated_by: 'user-123',
        },
        include: {
          person: true,
        },
      });

      expect(result).toEqual(mockLead);
    });

    it('should create a lead with addresses, contacts, and documents', async () => {
      const leadData = {
        lead_type: 'customer',
        lead_status: 'new',
        lead_temperature: 'warm',
        lead_origin: 'website',
        lead_description: 'Test lead',
        lead_notes: ['Note 1'],
        first_contacted_by: 'user-123',
      };

      const personData = {
        full_name: 'John Doe',
        document_type: 'cpf',
        document_number: '12345678901',
        addresses: [
          {
            address_line_1: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            zip_code: '10001',
            is_primary: true,
          },
        ],
        contacts: [
          {
            contact_type: 'email',
            contact_value: 'john@example.com',
            is_primary: true,
          },
        ],
        documents: [
          {
            document_type: 'cpf',
            document_number: '12345678901',
            is_primary: true,
          },
        ],
      };

      const mockPerson = {
        id: 'person-123',
        ...personData,
      };

      const mockLead = {
        id: 'lead-123',
        person_id: mockPerson.id,
        ...leadData,
        person: mockPerson,
      };

      mockPrismaService.person.create.mockResolvedValue(mockPerson);
      mockPrismaService.lead.create.mockResolvedValue(mockLead);
      mockPrismaService.address.create.mockResolvedValue({ id: 'address-123' });
      mockPrismaService.contact.create.mockResolvedValue({ id: 'contact-123' });
      mockPrismaService.document.create.mockResolvedValue({ id: 'document-123' });
      mockPrismaService.address.count.mockResolvedValue(0);
      mockPrismaService.contact.count.mockResolvedValue(0);
      mockPrismaService.document.count.mockResolvedValue(0);

      const result = await service.createLead(leadData, personData, 'user-123');

      expect(mockPrismaService.address.create).toHaveBeenCalled();
      expect(mockPrismaService.contact.create).toHaveBeenCalled();
      expect(mockPrismaService.document.create).toHaveBeenCalled();
      expect(result).toEqual(mockLead);
    });
  });

  describe('getLeadById', () => {
    it('should return a lead by ID with all related data', async () => {
      const mockLead = {
        id: 'lead-123',
        lead_type: 'customer',
        lead_status: 'new',
        person: {
          id: 'person-123',
          full_name: 'John Doe',
          addresses: [],
          contacts: [],
          documents: [],
        },
      };

      mockPrismaService.lead.findUnique.mockResolvedValue(mockLead);

      const result = await service.getLeadById('lead-123');

      expect(mockPrismaService.lead.findUnique).toHaveBeenCalledWith({
        where: { id: 'lead-123' },
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

      expect(result).toEqual(mockLead);
    });
  });

  describe('getAllLeads', () => {
    it('should return paginated leads', async () => {
      const mockLeads = [
        {
          id: 'lead-123',
          lead_type: 'customer',
          lead_status: 'new',
          person: {
            id: 'person-123',
            full_name: 'John Doe',
            addresses: [],
            contacts: [],
            documents: [],
          },
        },
      ];

      mockPrismaService.lead.findMany.mockResolvedValue(mockLeads);
      mockPrismaService.lead.count.mockResolvedValue(1);

      const result = await service.getAllLeads(1, 10);

      expect(mockPrismaService.lead.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
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
      });

      expect(result).toEqual({
        leads: mockLeads,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('updateLead', () => {
    it('should update a lead successfully', async () => {
      const leadId = 'lead-123';
      const leadData = {
        lead_status: 'contacted',
        lead_temperature: 'hot',
      };

      const personData = {
        full_name: 'John Doe Updated',
      };

      const mockLead = {
        id: leadId,
        person_id: 'person-123',
        ...leadData,
        person: { id: 'person-123' },
      };

      mockPrismaService.lead.update.mockResolvedValue(mockLead);
      mockPrismaService.person.update.mockResolvedValue({ id: 'person-123' });

      const result = await service.updateLead(leadId, leadData, personData, 'user-123');

      expect(mockPrismaService.lead.update).toHaveBeenCalledWith({
        where: { id: leadId },
        data: {
          ...leadData,
          updated_by: 'user-123',
        },
        include: {
          person: true,
        },
      });

      expect(mockPrismaService.person.update).toHaveBeenCalledWith({
        where: { id: 'person-123' },
        data: {
          ...personData,
          updated_by: 'user-123',
        },
      });

      expect(result).toEqual(mockLead);
    });
  });

  describe('deleteLead', () => {
    it('should soft delete a lead', async () => {
      const leadId = 'lead-123';
      const userId = 'user-123';

      mockPrismaService.lead.update.mockResolvedValue({ id: leadId });

      await service.deleteLead(leadId, userId);

      expect(mockPrismaService.lead.update).toHaveBeenCalledWith({
        where: { id: leadId },
        data: {
          deleted_at: expect.any(Date),
          deleted_by: userId,
        },
      });
    });
  });

  describe('handleAddressPrimaryFlag', () => {
    it('should return true for first address', async () => {
      mockPrismaService.address.count.mockResolvedValue(0);

      const result = await service.handleAddressPrimaryFlag('person-123', true);

      expect(result).toBe(true);
    });

    it('should handle primary flag for existing addresses', async () => {
      mockPrismaService.address.count.mockResolvedValue(2);
      mockPrismaService.address.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.handleAddressPrimaryFlag('person-123', true);

      expect(mockPrismaService.address.updateMany).toHaveBeenCalledWith({
        where: {
          person_id: 'person-123',
          is_primary: true,
          deleted_at: null,
        },
        data: {
          is_primary: false,
        },
      });

      expect(result).toBe(true);
    });
  });

  describe('handleContactPrimaryFlag', () => {
    it('should return true for first contact', async () => {
      mockPrismaService.contact.count.mockResolvedValue(0);

      const result = await service.handleContactPrimaryFlag('person-123', true);

      expect(result).toBe(true);
    });

    it('should handle primary flag for existing contacts', async () => {
      mockPrismaService.contact.count.mockResolvedValue(2);
      mockPrismaService.contact.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.handleContactPrimaryFlag('person-123', true);

      expect(mockPrismaService.contact.updateMany).toHaveBeenCalledWith({
        where: {
          person_id: 'person-123',
          is_primary: true,
          deleted_at: null,
        },
        data: {
          is_primary: false,
        },
      });

      expect(result).toBe(true);
    });
  });

  describe('handleDocumentPrimaryFlag', () => {
    it('should return true for first document', async () => {
      mockPrismaService.document.count.mockResolvedValue(0);

      const result = await service.handleDocumentPrimaryFlag('person-123', true);

      expect(result).toBe(true);
    });

    it('should handle primary flag for existing documents', async () => {
      mockPrismaService.document.count.mockResolvedValue(2);
      mockPrismaService.document.updateMany.mockResolvedValue({ count: 1 });

      const result = await service.handleDocumentPrimaryFlag('person-123', true);

      expect(mockPrismaService.document.updateMany).toHaveBeenCalledWith({
        where: {
          person_id: 'person-123',
          is_primary: true,
          deleted_at: null,
        },
        data: {
          is_primary: false,
        },
      });

      expect(result).toBe(true);
    });
  });
});
