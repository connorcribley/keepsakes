/*
  Warnings:

  - You are about to drop the column `currentLocation` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `location` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "currentLocation",
ADD COLUMN     "location" geometry NOT NULL,
ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "currentLocation" DROP NOT NULL;
