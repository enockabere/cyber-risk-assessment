/*
  Warnings:

  - You are about to drop the column `scoringModelId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `weight` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `answers` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `flagged` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `riskScore` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `submittedBy` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the column `university` on the `Submission` table. All the data in the column will be lost.
  - The `role` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `ScoringDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ScoringModel` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `questionnaireId` to the `QuestionnaireSection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `backgroundData` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionnaireId` to the `Submission` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Submission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'RESPONDENT');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('TEXT', 'DROPDOWN', 'DATE', 'NUMBER');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('VERY_LOW', 'LOW', 'MEDIUM', 'HIGH', 'VERY_HIGH');

-- CreateEnum
CREATE TYPE "RiskRating" AS ENUM ('SUSTAINABLE', 'MODERATE', 'SEVERE', 'CRITICAL');

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_scoringModelId_fkey";

-- DropForeignKey
ALTER TABLE "ScoringDetail" DROP CONSTRAINT "ScoringDetail_submissionId_fkey";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "scoringModelId",
DROP COLUMN "type",
DROP COLUMN "weight";

-- AlterTable
ALTER TABLE "QuestionnaireSection" ADD COLUMN     "questionnaireId" TEXT NOT NULL,
ALTER COLUMN "position" SET DEFAULT '0';

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "answers",
DROP COLUMN "flagged",
DROP COLUMN "riskScore",
DROP COLUMN "submittedBy",
DROP COLUMN "university",
ADD COLUMN     "backgroundData" JSONB NOT NULL,
ADD COLUMN     "questionnaireId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'RESPONDENT';

-- DropTable
DROP TABLE "ScoringDetail";

-- DropTable
DROP TABLE "ScoringModel";

-- DropEnum
DROP TYPE "QuestionType";

-- CreateTable
CREATE TABLE "Questionnaire" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Questionnaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackgroundField" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "fieldType" "FieldType" NOT NULL,
    "options" TEXT[],
    "questionnaireId" TEXT NOT NULL,

    CONSTRAINT "BackgroundField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskOption" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "probability" "RiskLevel" NOT NULL,
    "impact" "RiskLevel" NOT NULL,
    "rating" "RiskRating" NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "RiskOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskControl" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "residualProbability" "RiskLevel" NOT NULL,
    "residualImpact" "RiskLevel" NOT NULL,
    "residualRating" "RiskRating" NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "RiskControl_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "selectedOptionId" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BackgroundField" ADD CONSTRAINT "BackgroundField_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionnaireSection" ADD CONSTRAINT "QuestionnaireSection_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskOption" ADD CONSTRAINT "RiskOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RiskControl" ADD CONSTRAINT "RiskControl_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_questionnaireId_fkey" FOREIGN KEY ("questionnaireId") REFERENCES "Questionnaire"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "RiskOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
