-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "scoringModelId" TEXT;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_scoringModelId_fkey" FOREIGN KEY ("scoringModelId") REFERENCES "ScoringModel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
