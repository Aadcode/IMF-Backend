/*
  Warnings:

  - You are about to drop the `Gadgdet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Gadgdet";

-- CreateTable
CREATE TABLE "Gadget" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "StatusEnum" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gadget_pkey" PRIMARY KEY ("id")
);
