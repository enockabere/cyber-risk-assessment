/*
  Warnings:

  - You are about to drop the column `questionnaireId` on the `BackgroundField` table. All the data in the column will be lost.
  - You are about to drop the column `sectionId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `questionnaireId` on the `Submission` table. All the data in the column will be lost.
  - You are about to drop the `Questionnaire` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `QuestionnaireSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BackgroundField" DROP CONSTRAINT "BackgroundField_questionnaireId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_sectionId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionnaireSection" DROP CONSTRAINT "QuestionnaireSection_parentId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionnaireSection" DROP CONSTRAINT "QuestionnaireSection_questionnaireId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_questionnaireId_fkey";

-- AlterTable
ALTER TABLE "BackgroundField" DROP COLUMN "questionnaireId";

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "sectionId",
ADD COLUMN     "backgroundFieldId" TEXT;

-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "questionnaireId";

-- DropTable
DROP TABLE "Questionnaire";

-- DropTable
DROP TABLE "QuestionnaireSection";

-- CreateTable
CREATE TABLE "BackgroundResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BackgroundResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BackgroundResponse_userId_fieldId_key" ON "BackgroundResponse"("userId", "fieldId");

-- AddForeignKey
ALTER TABLE "BackgroundResponse" ADD CONSTRAINT "BackgroundResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BackgroundResponse" ADD CONSTRAINT "BackgroundResponse_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "BackgroundField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_backgroundFieldId_fkey" FOREIGN KEY ("backgroundFieldId") REFERENCES "BackgroundField"("id") ON DELETE SET NULL ON UPDATE CASCADE;
