-- AlterTable
ALTER TABLE "QuestionnaireSection" ADD COLUMN     "parentId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "QuestionnaireSection" ADD CONSTRAINT "QuestionnaireSection_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "QuestionnaireSection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
