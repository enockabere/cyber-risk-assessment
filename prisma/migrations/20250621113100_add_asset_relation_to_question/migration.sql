-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "assetId" TEXT;

-- AlterTable
ALTER TABLE "UniversityAsset" ADD COLUMN     "assessmentStatus" TEXT NOT NULL DEFAULT 'Pending',
ADD COLUMN     "residualRisk" "RiskRating",
ADD COLUMN     "riskRating" "RiskRating";

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
