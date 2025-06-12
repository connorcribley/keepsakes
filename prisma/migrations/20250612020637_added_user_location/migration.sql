/*
  Warnings:

  - You are about to drop the column `location` on the `Listing` table. All the data in the column will be lost.
  - Added the required column `currentLocation` to the `Listing` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "location",
ADD COLUMN     "currentLocation" geometry NOT NULL,
ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');
