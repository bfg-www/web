/*
  Warnings:

  - Added the required column `brandLogo` to the `Aircon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandUrl` to the `Aircon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandLogo` to the `Sale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandUrl` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Aircon" ADD COLUMN     "brandLogo" TEXT NOT NULL,
ADD COLUMN     "brandUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "brandLogo" TEXT NOT NULL,
ADD COLUMN     "brandUrl" TEXT NOT NULL;
