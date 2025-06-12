/*
  Warnings:

  - Added the required column `currentLocation` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentLocation" geometry NOT NULL;
