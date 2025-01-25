import { StatusEnum } from "@prisma/client";
import prisma from "../db/db.js";

const statuses: StatusEnum[] = ["Available", "Deployed", "Destroyed", "Decommissioned"];

const seedData = async () => {
    try {
        const users = Array.from({ length: 100 }, (_, index) => ({
            name: `User ${index + 1}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
        }));

        await prisma.user.createMany({ data: users });
        console.log("Database successfully seeded!");
    } catch (e: any) {
        console.error("Error seeding database:", e.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
        console.log("Database disconnected successfully");
    }
};

seedData();
