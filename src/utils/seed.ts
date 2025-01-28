import { StatusEnum } from "@prisma/client";
import prisma from "../db/db.js";
import bcrypt from "bcryptjs";



const SALT_ROUNDS = 10;
const GADGETS_PER_USER = 20; // Each user will get 20 gadgets

const STATUSES: StatusEnum[] = ["Available", "Deployed", "Destroyed", "Decommissioned"];

const USERS = [
    { name: "Alice", email: "alice@gmail.com" },
    { name: "Bob", email: "bob@gmail.com" },
    { name: "Mio", email: "mio@gmail.com" },
    { name: "Coco", email: "coco@gmail.com" },
    { name: "Kio", email: "kio@gmail.com" }
] as const;

const generateGadgets = (userId: number, startIndex: number) =>
    Array.from({ length: GADGETS_PER_USER }, (_, index) => ({
        name: `Gadget ${startIndex + index + 1}`,
        status: STATUSES[Math.floor(Math.random() * STATUSES.length)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)), // Random date within last 90 days
        updatedAt: new Date(),
        userId: userId
    }));

const generateUsers = async () =>
    Promise.all(USERS.map(async (user) => ({
        name: user.name,
        email: user.email,
        password: await bcrypt.hash(`${user.name}@123`, SALT_ROUNDS),
        createdAt: new Date(),
        updatedAt: new Date()
    })));

const clearDatabase = async () => {
    console.log("Clearing existing data...");
    // Clear gadgets first due to foreign key constraint
    await prisma.gadget.deleteMany();
    await prisma.user.deleteMany();
};

const seedDatabase = async () => {
    try {
        console.log("Starting database seeding...");

        // Clear existing data
        await clearDatabase();

        // Seed users first
        console.log("Seeding users...");
        const userData = await generateUsers();
        const createdUsers = await prisma.user.createMany({ data: userData });
        console.log(`Created ${createdUsers.count} users`);

        // Get all users to get their IDs
        const users = await prisma.user.findMany();

        // Seed gadgets for each user
        console.log("Seeding gadgets...");
        let totalGadgets = 0;

        for (const user of users) {
            const gadgets = generateGadgets(user.id, totalGadgets);
            await prisma.gadget.createMany({ data: gadgets });
            totalGadgets += GADGETS_PER_USER;
        }

        console.log(`Created ${totalGadgets} gadgets (${GADGETS_PER_USER} per user)`);
        console.log("Database seeding completed successfully!");

        // Log summary
        console.log("\nSeeding Summary:");
        for (const user of users) {
            const gadgetCount = await prisma.gadget.count({
                where: { userId: user.id }
            });
            console.log(`${user.name} (${user.email}): ${gadgetCount} gadgets`);
        }

    } catch (error) {
        console.error("Error seeding database:", error instanceof Error ? error.message : "Unknown error");
        throw error;
    } finally {
        await prisma.$disconnect();
        console.log("Database connection closed");
    }
};

// Execute seeding
seedDatabase()
    .catch((error) => {
        console.error("Fatal error during seeding:", error);
        process.exit(1);
    });