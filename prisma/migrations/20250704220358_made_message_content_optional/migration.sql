-- AlterTable
ALTER TABLE "DirectMessage" ALTER COLUMN "content" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');
