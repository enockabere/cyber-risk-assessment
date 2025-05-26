/*
  Warnings:

  - You are about to drop the `RiskControl` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RiskControl" DROP CONSTRAINT "RiskControl_questionId_fkey";

-- AlterTable
ALTER TABLE "RiskOption" ADD COLUMN     "controlDescription" TEXT,
ADD COLUMN     "residualImpact" "RiskLevel",
ADD COLUMN     "residualProbability" "RiskLevel",
ADD COLUMN     "residualRating" "RiskRating",
ALTER COLUMN "probability" DROP NOT NULL,
ALTER COLUMN "impact" DROP NOT NULL;

-- DropTable
DROP TABLE "RiskControl";
