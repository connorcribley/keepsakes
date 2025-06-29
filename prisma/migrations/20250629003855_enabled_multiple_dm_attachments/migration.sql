/*
  Warnings:

  - The `attachmentUrl` column on the `DirectMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "DirectMessage" DROP COLUMN "attachmentUrl",
ADD COLUMN     "attachmentUrl" TEXT[];

-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');
