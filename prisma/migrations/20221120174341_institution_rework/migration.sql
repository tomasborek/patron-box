/*
  Warnings:

  - You are about to drop the column `authForm` on the `Institution` table. All the data in the column will be lost.
  - You are about to drop the column `emailFormat` on the `Institution` table. All the data in the column will be lost.
  - You are about to drop the column `localId` on the `Station` table. All the data in the column will be lost.
  - Made the column `password` on table `Institution` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `address` to the `Station` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Station" DROP CONSTRAINT "Station_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_institutionId_fkey";

-- DropIndex
DROP INDEX "Institution_name_key";

-- AlterTable
ALTER TABLE "Institution" DROP COLUMN "authForm",
DROP COLUMN "emailFormat",
ALTER COLUMN "password" SET NOT NULL;

-- AlterTable
ALTER TABLE "Station" DROP COLUMN "localId",
ADD COLUMN     "address" TEXT NOT NULL,
ALTER COLUMN "institutionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "institutionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Station" ADD CONSTRAINT "Station_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE SET NULL ON UPDATE CASCADE;
