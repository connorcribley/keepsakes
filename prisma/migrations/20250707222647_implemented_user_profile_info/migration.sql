-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "location" TEXT;
