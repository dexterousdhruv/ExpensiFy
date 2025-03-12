/*
  Warnings:

  - You are about to drop the column `amountRemaining` on the `Budget` table. All the data in the column will be lost.
  - Added the required column `amountTotal` to the `Budget` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Budget" DROP COLUMN "amountRemaining",
ADD COLUMN     "amountTotal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "deletedAt" TIMESTAMP(3);
