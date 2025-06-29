-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityAsset" (
    "id" TEXT NOT NULL,
    "universityUserId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "hasBeenAssessed" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UniversityAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Threat" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "riskLevel" "RiskLevel" NOT NULL,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "Threat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MitigationStrategy" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "threatId" TEXT NOT NULL,

    CONSTRAINT "MitigationStrategy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_name_key" ON "Asset"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UniversityAsset_universityUserId_assetId_key" ON "UniversityAsset"("universityUserId", "assetId");

-- AddForeignKey
ALTER TABLE "UniversityAsset" ADD CONSTRAINT "UniversityAsset_universityUserId_fkey" FOREIGN KEY ("universityUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityAsset" ADD CONSTRAINT "UniversityAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Threat" ADD CONSTRAINT "Threat_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MitigationStrategy" ADD CONSTRAINT "MitigationStrategy_threatId_fkey" FOREIGN KEY ("threatId") REFERENCES "Threat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
