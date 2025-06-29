/*
  Warnings:

  - You are about to drop the column `attachmentUrl` on the `DirectMessage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DirectMessage" DROP COLUMN "attachmentUrl",
ADD COLUMN     "attachmentUrls" TEXT[];

-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');
