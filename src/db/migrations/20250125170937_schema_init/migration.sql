-- CreateEnum
CREATE TYPE "StatusEnum" AS ENUM ('Available', 'Deployed', 'Destroyed', 'Decommissioned');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
