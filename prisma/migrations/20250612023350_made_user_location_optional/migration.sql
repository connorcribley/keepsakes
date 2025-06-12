-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days'),
ALTER COLUMN "currentLocation" DROP NOT NULL;
