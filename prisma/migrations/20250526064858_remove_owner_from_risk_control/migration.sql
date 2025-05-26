/*
  Warnings:

  - You are about to drop the column `owner` on the `RiskControl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RiskControl" DROP COLUMN "owner",
ALTER COLUMN "residualRating" DROP NOT NULL;
