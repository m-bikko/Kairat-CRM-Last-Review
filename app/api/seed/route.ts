import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Lead from '@/models/Lead';
import Client from '@/models/Client';
import Employee from '@/models/Employee';
import Transaction from '@/models/Transaction';
import Invoice from '@/models/Invoice';
import Event from '@/models/Event';
import Task from '@/models/Task';
import Product from '@/models/Product';

// Kazakh names data
const kazakhFirstNames = [
  'Нурлан', 'Асет', 'Ерболат', 'Бауыржан', 'Талгат', 'Канат', 'Серик', 'Марат', 'Данияр', 'Айдос',
  'Айгуль', 'Динара', 'Гульнара', 'Жанна', 'Камила', 'Мадина', 'Сауле', 'Асель', 'Дина', 'Жанар'
];

const kazakhLastNames = [
  'Сериков', 'Нурланов', 'Алиев', 'Жумабаев', 'Касымов', 'Байтурсынов', 'Абдуллин', 'Оспанов', 'Мухтаров', 'Токаев',
  'Жансугуров', 'Кенжебаев', 'Садыков', 'Умирзаков', 'Ахметов', 'Бектуров', 'Искаков', 'Турсынов', 'Есимов', 'Назарбаев'
];

const kazakhCompanies = [
  'ТОО "КазТехСервис"', 'АО "Алматы Энерго"', 'ТОО "Астана Групп"', 'АО "КазМунайГаз"', 'ТОО "СтройИнвест"',
  'АО "Народный Банк"', 'ТОО "ТехноМир"', 'АО "Казахтелеком"', 'ТОО "АгроХолдинг"', 'АО "Эйр Астана"',
  'ТОО "МедСервис"', 'АО "KEGOC"', 'ТОО "ЛогистикКЗ"', 'АО "Казпочта"', 'ТОО "ФудМаркет"',
  'АО "КазТрансОйл"', 'ТОО "IT Solutions KZ"', 'АО "Самрук-Казына"', 'ТОО "ЭкоСтрой"', 'АО "Kaspi Bank"'
];

const kazakhCities = ['Алматы', 'Астана', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Семей', 'Атырау', 'Костанай'];

const getRandomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomValue = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const getRandomDate = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date;
};
const generatePhone = () => `+7 (7${getRandomValue(0, 9)}${getRandomValue(0, 9)}) ${getRandomValue(100, 999)}-${getRandomValue(10, 99)}-${getRandomValue(10, 99)}`;
const generateEmail = (firstName: string, lastName: string) => {
  const domains = ['mail.kz', 'gmail.com', 'yandex.kz', 'inbox.kz', 'outlook.com'];
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${getRandomItem(domains)}`;
};

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Clear existing data
    await Promise.all([
      Lead.deleteMany({}),
      Client.deleteMany({}),
      Employee.deleteMany({}),
      Transaction.deleteMany({}),
      Invoice.deleteMany({}),
      Event.deleteMany({}),
      Task.deleteMany({}),
      Product.deleteMany({}),
    ]);

    // Create Leads (20 leads across all pipeline stages)
    const leadStatuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost'];
    const priorities = ['low', 'medium', 'high'];
    const leads = [];

    for (let i = 0; i < 20; i++) {
      const firstName = getRandomItem(kazakhFirstNames);
      const lastName = getRandomItem(kazakhLastNames);
      const status = getRandomItem(leadStatuses);
      leads.push({
        name: `${firstName} ${lastName}`,
        email: generateEmail(firstName, lastName),
        phone: generatePhone(),
        company: getRandomItem(kazakhCompanies),
        value: getRandomValue(500000, 15000000),
        status,
        priority: getRandomItem(priorities),
        notes: `Потенциальный клиент из ${getRandomItem(kazakhCities)}`,
        position: i,
        createdAt: getRandomDate(60),
      });
    }
    await Lead.insertMany(leads);

    // Create Clients (15 clients)
    const clientStatuses = ['active', 'inactive', 'prospect'];
    const clients = [];

    for (let i = 0; i < 15; i++) {
      const firstName = getRandomItem(kazakhFirstNames);
      const lastName = getRandomItem(kazakhLastNames);
      clients.push({
        name: `${firstName} ${lastName}`,
        email: generateEmail(firstName, lastName),
        phone: generatePhone(),
        company: getRandomItem(kazakhCompanies),
        address: `${getRandomItem(kazakhCities)}, ул. ${getRandomItem(['Абая', 'Достык', 'Сатпаева', 'Толе би', 'Жандосова'])} ${getRandomValue(1, 200)}`,
        totalSpent: getRandomValue(1000000, 50000000),
        status: getRandomItem(clientStatuses),
        notes: `Клиент с ${getRandomDate(365).getFullYear()} года`,
        createdAt: getRandomDate(365),
      });
    }
    await Client.insertMany(clients);

    // Create Employees (10 employees)
    const departments = ['Продажи', 'Маркетинг', 'Разработка', 'Поддержка', 'Финансы', 'HR'];
    const positions = ['Менеджер', 'Старший специалист', 'Руководитель отдела', 'Директор', 'Аналитик', 'Специалист'];
    const employeeStatuses = ['active', 'on_leave', 'terminated'];
    const employees = [];

    for (let i = 0; i < 10; i++) {
      const firstName = getRandomItem(kazakhFirstNames);
      const lastName = getRandomItem(kazakhLastNames);
      const department = getRandomItem(departments);
      employees.push({
        name: `${firstName} ${lastName}`,
        email: generateEmail(firstName, lastName),
        phone: generatePhone(),
        position: `${getRandomItem(positions)} ${department.toLowerCase()}`,
        department,
        salary: getRandomValue(300000, 1500000),
        status: i === 0 ? 'active' : getRandomItem(employeeStatuses),
        hireDate: getRandomDate(1000),
        createdAt: getRandomDate(365),
      });
    }
    await Employee.insertMany(employees);

    // Create Transactions (25 transactions)
    const transactionTypes = ['income', 'expense'];
    const transactionStatuses = ['completed', 'pending', 'cancelled'];
    const incomeCategories = ['Продажи', 'Услуги', 'Консалтинг', 'Подписка', 'Комиссия'];
    const expenseCategories = ['Зарплата', 'Аренда', 'Реклама', 'Оборудование', 'Транспорт', 'Коммунальные'];
    const transactions = [];

    for (let i = 0; i < 25; i++) {
      const type = getRandomItem(transactionTypes);
      const category = type === 'income' ? getRandomItem(incomeCategories) : getRandomItem(expenseCategories);
      transactions.push({
        description: `${type === 'income' ? 'Поступление' : 'Оплата'}: ${category}`,
        amount: getRandomValue(100000, 5000000),
        type,
        category,
        date: getRandomDate(90),
        status: getRandomItem(transactionStatuses),
        reference: `ТР-${getRandomValue(1000, 9999)}`,
        notes: `${category} за ${getRandomItem(['январь', 'февраль', 'март', 'апрель', 'май', 'июнь'])}`,
        createdAt: getRandomDate(90),
      });
    }
    await Transaction.insertMany(transactions);

    // Create Invoices (12 invoices)
    const invoiceStatuses = ['paid', 'pending', 'overdue', 'cancelled'];
    const services = ['Внедрение CRM', 'Техническая поддержка', 'Консалтинг', 'Разработка ПО', 'Обучение персонала', 'Аудит систем'];
    const invoices = [];

    for (let i = 0; i < 12; i++) {
      const firstName = getRandomItem(kazakhFirstNames);
      const lastName = getRandomItem(kazakhLastNames);
      const issueDate = getRandomDate(60);
      const dueDate = new Date(issueDate);
      dueDate.setDate(dueDate.getDate() + 30);
      invoices.push({
        invoiceNumber: `СЧ-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        clientName: `${firstName} ${lastName}`,
        clientEmail: generateEmail(firstName, lastName),
        service: getRandomItem(services),
        amount: getRandomValue(500000, 10000000),
        status: getRandomItem(invoiceStatuses),
        issueDate,
        dueDate,
        notes: `Счёт для ${getRandomItem(kazakhCompanies)}`,
        createdAt: issueDate,
      });
    }
    await Invoice.insertMany(invoices);

    // Create Events (15 events for calendar)
    const eventTypes = ['meeting', 'call', 'task', 'reminder'];
    const eventTitles = [
      'Встреча с клиентом', 'Презентация продукта', 'Планёрка команды', 'Звонок партнёру',
      'Обсуждение проекта', 'Демонстрация CRM', 'Переговоры', 'Тренинг по продажам',
      'Отчёт руководству', 'Анализ конкурентов', 'Стратегическая сессия', 'Подписание договора'
    ];
    const events = [];

    for (let i = 0; i < 15; i++) {
      const startDate = getRandomDate(-30); // -30 means future dates
      const startHour = getRandomValue(9, 17);
      startDate.setHours(startHour, 0, 0, 0);
      const endDate = new Date(startDate);
      endDate.setHours(startHour + getRandomValue(1, 2));
      events.push({
        title: getRandomItem(eventTitles),
        description: `Участники: ${getRandomItem(kazakhFirstNames)} ${getRandomItem(kazakhLastNames)}, ${getRandomItem(kazakhFirstNames)} ${getRandomItem(kazakhLastNames)}`,
        startDate,
        endDate,
        type: getRandomItem(eventTypes),
        location: `${getRandomItem(kazakhCities)}, офис ${getRandomItem(kazakhCompanies)}`,
        createdAt: new Date(),
      });
    }
    await Event.insertMany(events);

    // Create Tasks (12 tasks)
    const taskStatuses = ['pending', 'in_progress', 'completed'];
    const taskTitles = [
      'Связаться с клиентом', 'Подготовить презентацию', 'Отправить коммерческое предложение',
      'Провести анализ рынка', 'Обновить базу данных', 'Написать отчёт', 'Организовать встречу',
      'Проверить контракт', 'Настроить интеграцию', 'Обучить новых сотрудников',
      'Подготовить документы', 'Согласовать бюджет'
    ];
    const tasks = [];

    for (let i = 0; i < 12; i++) {
      tasks.push({
        title: taskTitles[i],
        description: `Задача для ${getRandomItem(kazakhCompanies)}`,
        priority: getRandomItem(priorities),
        status: getRandomItem(taskStatuses),
        dueDate: getRandomDate(-14), // Future date
        assignee: `${getRandomItem(kazakhFirstNames)} ${getRandomItem(kazakhLastNames)}`,
        createdAt: getRandomDate(30),
      });
    }
    await Task.insertMany(tasks);

    // Create Products (8 products)
    const productStatuses = ['active', 'draft', 'archived'];
    const stockTypes = ['unlimited', 'limited', 'out_of_stock'];
    const productData = [
      { name: 'CRM Корпоративный', category: 'Программное обеспечение', price: 500000, description: 'Полнофункциональная CRM система для крупных компаний' },
      { name: 'CRM Стартап', category: 'Программное обеспечение', price: 150000, description: 'Облегчённая версия CRM для стартапов и малого бизнеса' },
      { name: 'Внедрение CRM', category: 'Услуги', price: 2000000, description: 'Полный цикл внедрения CRM системы с обучением' },
      { name: 'Техническая поддержка', category: 'Услуги', price: 100000, description: 'Ежемесячная техническая поддержка 24/7' },
      { name: 'Обучение персонала', category: 'Услуги', price: 300000, description: 'Корпоративное обучение работе с CRM' },
      { name: 'Интеграция 1С', category: 'Интеграции', price: 500000, description: 'Интеграция CRM с 1С Бухгалтерией' },
      { name: 'API доступ', category: 'Дополнительно', price: 50000, description: 'Доступ к API для кастомных интеграций' },
      { name: 'Мобильное приложение', category: 'Программное обеспечение', price: 75000, description: 'Мобильное приложение для iOS и Android' },
    ];

    const products = productData.map((p, i) => ({
      ...p,
      stock: getRandomItem(stockTypes),
      stockQuantity: getRandomValue(10, 100),
      status: i < 6 ? 'active' : getRandomItem(productStatuses),
      sku: `PRD-${String(i + 1).padStart(3, '0')}`,
      createdAt: getRandomDate(180),
    }));
    await Product.insertMany(products);

    return NextResponse.json({
      success: true,
      message: 'Данные успешно созданы',
      created: {
        leads: leads.length,
        clients: clients.length,
        employees: employees.length,
        transactions: transactions.length,
        invoices: invoices.length,
        events: events.length,
        tasks: tasks.length,
        products: products.length,
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Ошибка при создании данных' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Seed API - Используйте POST запрос для создания тестовых данных',
    warning: 'Внимание: POST запрос удалит все существующие данные!',
  });
}
