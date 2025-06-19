-- AlterTable
ALTER TABLE "Listing" ALTER COLUMN "expiresAt" SET DEFAULT (now() + interval '7 days');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "codeExpiresAt" TIMESTAMP(3),
ADD COLUMN     "verificationCode" TEXT;
