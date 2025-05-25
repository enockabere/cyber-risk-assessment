/*
  Warnings:

  - The `position` column on the `QuestionnaireSection` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "QuestionnaireSection" ADD COLUMN     "depth" INTEGER NOT NULL DEFAULT 1,
DROP COLUMN "position",
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;
