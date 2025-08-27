import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../../src/Application/Services/customer.service';
import { PrismaService } from '../../src/Infrastructure/Database/postgres.context';

describe('CustomerService', () => {
  let service: CustomerService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    person: {
      create: jest.fn(),
      update: jest.fn(),
    },
    customer: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    lead: {
      findUnique: jest.fn(),
      update: jest.fn(),
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
        CustomerService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createCustomer', () => {
    it('should create a customer with person data successfully', async () => {
      const customerData = {
        customer_type: 'individual',
        customer_status: 'active',
        fidelized_by: 'user-123',
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

      const mockCustomer = {
        id: 'customer-123',
        person_id: mockPerson.id,
        ...customerData,
        person: mockPerson,
      };

      mockPrismaService.person.create.mockResolvedValue(mockPerson);
      mockPrismaService.customer.create.mockResolvedValue(mockCustomer);

      const result = await service.createCustomer(customerData, personData, 'user-123');

      expect(mockPrismaService.person.create).toHaveBeenCalledWith({
        data: {
          ...personData,
          created_by: 'user-123',
          updated_by: 'user-123',
        },
      });

      expect(mockPrismaService.customer.create).toHaveBeenCalledWith({
        data: {
          ...customerData,
          person_id: mockPerson.id,
          created_by: 'user-123',
          updated_by: 'user-123',
        },
        include: {
          person: true,
        },
      });

      expect(result).toEqual(mockCustomer);
    });

    it('should create a customer with addresses, contacts, and documents', async () => {
      const customerData = {
        customer_type: 'individual',
        customer_status: 'active',
        fidelized_by: 'user-123',
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

      const mockCustomer = {
        id: 'customer-123',
        person_id: mockPerson.id,
        ...customerData,
        person: mockPerson,
      };

      mockPrismaService.person.create.mockResolvedValue(mockPerson);
      mockPrismaService.customer.create.mockResolvedValue(mockCustomer);
      mockPrismaService.address.create.mockResolvedValue({ id: 'address-123' });
      mockPrismaService.contact.create.mockResolvedValue({ id: 'contact-123' });
      mockPrismaService.document.create.mockResolvedValue({ id: 'document-123' });
      mockPrismaService.address.count.mockResolvedValue(0);
      mockPrismaService.contact.count.mockResolvedValue(0);
      mockPrismaService.document.count.mockResolvedValue(0);

      const result = await service.createCustomer(customerData, personData, 'user-123');

      expect(mockPrismaService.address.create).toHaveBeenCalled();
      expect(mockPrismaService.contact.create).toHaveBeenCalled();
      expect(mockPrismaService.document.create).toHaveBeenCalled();
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer by ID with all related data', async () => {
      const mockCustomer = {
        id: 'customer-123',
        customer_type: 'individual',
        customer_status: 'active',
        person: {
          id: 'person-123',
          full_name: 'John Doe',
          addresses: [],
          contacts: [],
          documents: [],
        },
      };

      mockPrismaService.customer.findUnique.mockResolvedValue(mockCustomer);

      const result = await service.getCustomerById('customer-123');

      expect(mockPrismaService.customer.findUnique).toHaveBeenCalledWith({
        where: { id: 'customer-123' },
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

      expect(result).toEqual(mockCustomer);
    });
  });

  describe('getAllCustomers', () => {
    it('should return paginated customers', async () => {
      const mockCustomers = [
        {
          id: 'customer-123',
          customer_type: 'individual',
          customer_status: 'active',
          person: {
            id: 'person-123',
            full_name: 'John Doe',
            addresses: [],
            contacts: [],
            documents: [],
          },
        },
      ];

      mockPrismaService.customer.findMany.mockResolvedValue(mockCustomers);
      mockPrismaService.customer.count.mockResolvedValue(1);

      const result = await service.getAllCustomers(1, 10);

      expect(mockPrismaService.customer.findMany).toHaveBeenCalledWith({
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
        customers: mockCustomers,
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      });
    });
  });

  describe('updateCustomer', () => {
    it('should update a customer successfully', async () => {
      const customerId = 'customer-123';
      const customerData = {
        customer_status: 'inactive',
      };

      const personData = {
        full_name: 'John Doe Updated',
      };

      const mockCustomer = {
        id: customerId,
        person_id: 'person-123',
        ...customerData,
        person: { id: 'person-123' },
      };

      mockPrismaService.customer.update.mockResolvedValue(mockCustomer);
      mockPrismaService.person.update.mockResolvedValue({ id: 'person-123' });

      const result = await service.updateCustomer(customerId, customerData, personData, 'user-123');

      expect(mockPrismaService.customer.update).toHaveBeenCalledWith({
        where: { id: customerId },
        data: {
          ...customerData,
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

      expect(result).toEqual(mockCustomer);
    });
  });

  describe('deleteCustomer', () => {
    it('should soft delete a customer', async () => {
      const customerId = 'customer-123';
      const userId = 'user-123';

      mockPrismaService.customer.update.mockResolvedValue({ id: customerId });

      await service.deleteCustomer(customerId, userId);

      expect(mockPrismaService.customer.update).toHaveBeenCalledWith({
        where: { id: customerId },
        data: {
          deleted_at: expect.any(Date),
          deleted_by: userId,
        },
      });
    });
  });

  describe('convertLeadToCustomer', () => {
    it('should convert a lead to customer successfully', async () => {
      const leadId = 'lead-123';
      const customerData = {
        customer_type: 'individual',
        customer_status: 'active',
        fidelized_by: 'user-123',
      };

      const mockLead = {
        id: leadId,
        person_id: 'person-123',
        person: {
          id: 'person-123',
          full_name: 'John Doe',
        },
      };

      const mockCustomer = {
        id: 'customer-123',
        person_id: 'person-123',
        ...customerData,
        person: mockLead.person,
      };

      mockPrismaService.lead.findUnique.mockResolvedValue(mockLead);
      mockPrismaService.customer.create.mockResolvedValue(mockCustomer);
      mockPrismaService.lead.update.mockResolvedValue({ id: leadId });

      const result = await service.convertLeadToCustomer(leadId, customerData, 'user-123');

      expect(mockPrismaService.lead.findUnique).toHaveBeenCalledWith({
        where: { id: leadId },
        include: {
          person: true,
        },
      });

      expect(mockPrismaService.customer.create).toHaveBeenCalledWith({
        data: {
          ...customerData,
          person_id: 'person-123',
          created_by: 'user-123',
          updated_by: 'user-123',
        },
        include: {
          person: true,
        },
      });

      expect(mockPrismaService.lead.update).toHaveBeenCalledWith({
        where: { id: leadId },
        data: {
          deleted_at: expect.any(Date),
          deleted_by: 'user-123',
        },
      });

      expect(result).toEqual(mockCustomer);
    });

    it('should throw error when lead not found', async () => {
      const leadId = 'lead-123';
      const customerData = {
        customer_type: 'individual',
        customer_status: 'active',
      };

      mockPrismaService.lead.findUnique.mockResolvedValue(null);

      await expect(service.convertLeadToCustomer(leadId, customerData, 'user-123'))
        .rejects
        .toThrow('Lead not found');
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
