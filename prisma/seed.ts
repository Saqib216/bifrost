import 'dotenv/config';
import { PrismaClient, Role, TaskStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const admin = await prisma.user.upsert({
        where: {email: 'admin@ems.com'},
        update: {},
        create: {
            name: 'Muhammad Saqib Hussnain',
            email: 'admin@ems.com',
            password: adminPassword,
            role: Role.ADMIN,
            isDemo: true,
        },
    });

    const employeesData = [
        {
            name: 'Ali Raza',
            email: 'ali.raza@ems.com',
            password: 'Ali@1234',
            tasks: [
                {
                    title: 'Fix login page bug',
                    description: 'Resolve the validation error on the login form for empty password field.',
                    category: 'Bug Fix',
                    status: TaskStatus.ACTIVE,
                    taskDate: new Date('2026-07-10'),
                },
                {
                    title: 'Update product catalog UI',
                    description: 'Redesign the product listing page with new card layout.',
                    category: 'UI/UX',
                    status: TaskStatus.COMPLETED,
                    taskDate: new Date('2026-07-05'),
                },
            ],
        },
        {
            name: 'Ayesha Khan',
            email: 'ayesha.khan@ems.com',
            password: 'Ayesha@1234',
            tasks: [
                {
                    title: 'Prepare Q3 sales report',
                    description: 'Compile sales data from July to September into a summary report.',
                    category: 'Reporting',
                    status: TaskStatus.NEW,
                    taskDate: new Date('2026-07-12'),
                },
                {
                    title: 'Client onboarding call',
                    description: 'Schedule and conduct onboarding call with new client.',
                    category: 'Client Relations',
                    status: TaskStatus.ACTIVE,
                    taskDate: new Date('2026-07-11'),
                },
                {
                    title: 'Deploy marketing campaign',
                    description: 'Launch the email marketing campaign for new product line.',
                    category: 'Marketing',
                    status: TaskStatus.FAILED,
                    taskDate: new Date('2026-07-08'),
                },
            ],
        },
        {
            name: 'Bilal Ahmed',
            email: 'bilal.ahmed@ems.com',
            password: 'Bilal@1234',
            tasks: [
                {
                    title: 'Database backup setup',
                    description: 'Configure automated daily backups for the production database.',
                    category: 'Backend',
                    status: TaskStatus.ACTIVE,
                    taskDate: new Date('2026-07-09'),
                },
                {
                    title: 'API documentation update',
                    description: 'Update the REST API docs with new endpoint changes.',
                    category: 'Documentation',
                    status: TaskStatus.COMPLETED,
                    taskDate: new Date('2026-07-03'),
                },
            ],
        },
        {
            name: 'Fatima Malik',
            email: 'fatima.malik@ems.com',
            password: 'Fatima@1234',
            tasks: [
                {
                    title: 'Design new landing page',
                    description: 'Create wireframes and mockups for the upcoming landing page redesign.',
                    category: 'Design',
                    status: TaskStatus.NEW,
                    taskDate: new Date('2026-07-13'),
                },
                {
                    title: 'Team performance review',
                    description: 'Conduct quarterly performance reviews for the design team.',
                    category: 'HR',
                    status: TaskStatus.ACTIVE,
                    taskDate: new Date('2026-07-10'),
                },
            ],
        },
        {
            name: 'Hamza Sheikh',
            email: 'hamza.sheikh@ems.com',
            password: 'Hamza@1234',
            tasks: [
                {
                    title: 'Server migration',
                    description: 'Migrate legacy server infrastructure to new cloud provider.',
                    category: 'DevOps',
                    status: TaskStatus.COMPLETED,
                    taskDate: new Date('2026-07-01'),
                },
                {
                    title: 'Payment gateway integration',
                    description: 'Integrate Stripe payment gateway into checkout flow.',
                    category: 'Backend',
                    status: TaskStatus.FAILED,
                    taskDate: new Date('2026-07-06'),
                },
                {
                    title: 'Security audit',
                    description: 'Run a full security audit on the authentication system.',
                    category: 'Security',
                    status: TaskStatus.ACTIVE,
                    taskDate: new Date('2026-07-12'),
                },
            ],
        },
        {
            name: 'Zainab Iqbal',
            email: 'zainab.iqbal@ems.com',
            password: 'Zainab@1234',
            tasks: [
                {
                    title: 'Social media content calendar',
                    description: 'Plan and schedule social media posts for the next two weeks.',
                    category: 'Marketing',
                    status: TaskStatus.NEW,
                    taskDate: new Date('2026-07-13'),
                },
                {
                    title: 'Customer feedback analysis',
                    description: 'Analyze recent customer survey responses and summarize key insights.',
                    category: 'Research',
                    status: TaskStatus.ACTIVE,
                    taskDate: new Date('2026-07-09'),
                },
            ],
        },
    ];

    for (const emp of employeesData) {
        const hashedPassword = await bcrypt.hash(emp.password, 10);
        const existing = await prisma.user.findUnique({
            where: {email: emp.email},
        });
        if(existing) continue; // if already exists, skip creating

        await prisma.user.create({
            data: {
                name: emp.name,
                email: emp.email,
                password: hashedPassword,
                role: Role.EMPLOYEE,
                tasks: {
                    create: emp.tasks,
                },
                isDemo: true,
            },
        });
    }
    console.log('Seed complete:', admin.email, 'and', employeesData.length, 'employees added');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    })