-- DropForeignKey
ALTER TABLE "AirconDetail" DROP CONSTRAINT "AirconDetail_airconId_fkey";

-- AlterTable
ALTER TABLE "AirconDetail" ALTER COLUMN "airconId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "AirconDetail" ADD CONSTRAINT "AirconDetail_airconId_fkey" FOREIGN KEY ("airconId") REFERENCES "Aircon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
