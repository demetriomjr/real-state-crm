
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { WhatsappService } from '@/Application/Services/whatsapp.service';
import { PersonRepository } from '@/Infrastructure/Repositories/person.repository';
import { LeadRepository } from '@/Infrastructure/Repositories/lead.repository';
import { ContactRepository } from '@/Infrastructure/Repositories/contact.repository';
import { ChatRepository } from '@/Infrastructure/Repositories/chat.repository';
import { MessageRepository } from '@/Infrastructure/Repositories/message.repository';
import { Prisma, Person, Lead, Contact, Chat, Message } from '@prisma/client';
import { PostgresContext } from '@/Infrastructure/Database/postgres.context';

describe('WhatsappService Integration', () => {
  let app: INestApplication;
  let whatsappService: WhatsappService;
  let personRepository: PersonRepository;
  let leadRepository: LeadRepository;
  let contactRepository: ContactRepository;
  let chatRepository: ChatRepository;
  let messageRepository: MessageRepository;
  let prisma: PostgresContext;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    whatsappService = app.get<WhatsappService>(WhatsappService);
    personRepository = app.get<PersonRepository>(PersonRepository);
    leadRepository = app.get<LeadRepository>(LeadRepository);
    contactRepository = app.get<ContactRepository>(ContactRepository);
    chatRepository = app.get<ChatRepository>(ChatRepository);
    messageRepository = app.get<MessageRepository>(MessageRepository);
    prisma = app.get<PostgresContext>(PostgresContext);
  });

  afterAll(async () => {
    await app.close();
  });

  afterEach(async () => {
    await prisma.message.deleteMany({});
    await prisma.chat.deleteMany({});
    await prisma.lead.deleteMany({});
    await prisma.contact.deleteMany({});
    await prisma.person.deleteMany({});
  });

  it('should create a new Person, Lead, Chat and Message for a new contact', async () => {
    const webhookData = {
      message: {
        id: 'test-message-1',
        from: '5511999999999',
        type: 'text',
        text: { body: 'Hello' },
        notifyName: 'Test User',
      },
    };

    await whatsappService.receiveMessage(webhookData);

    const person = await prisma.person.findFirst({ where: { document_number: '5511999999999' } });
    expect(person).toBeDefined();

    const lead = await prisma.lead.findFirst({ where: { person_id: person.id } });
    expect(lead).toBeDefined();

    const chat = await prisma.chat.findFirst({ where: { person_id: person.id } });
    expect(chat).toBeDefined();

    const message = await prisma.message.findFirst({ where: { chat_id: chat.id } });
    expect(message).toBeDefined();
    expect(message.message_id).toBe('test-message-1');
  });

  it('should find an existing Person and create a new Chat and Message', async () => {
    const person = await personRepository.create({
      full_name: 'Existing User',
      document_type: 'whatsapp',
      document_number: '5511888888888',
    });

    await prisma.contact.create({
      data: {
        person_id: person.id,
        contact_type: 'phone',
        contact_value: '5511888888888',
      },
    });

    const webhookData = {
      message: {
        id: 'test-message-2',
        from: '5511888888888',
        type: 'text',
        text: { body: 'Hello again' },
        notifyName: 'Existing User',
      },
    };

    await whatsappService.receiveMessage(webhookData);

    const chat = await prisma.chat.findFirst({ where: { person_id: person.id } });
    expect(chat).toBeDefined();

    const message = await prisma.message.findFirst({ where: { chat_id: chat.id } });
    expect(message).toBeDefined();
    expect(message.message_id).toBe('test-message-2');
  });
});
