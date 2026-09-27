-- CreateEnum
CREATE TYPE "AccentColor" AS ENUM ('MAGENTA', 'BLUE', 'AMBER');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accentColor" "AccentColor" NOT NULL DEFAULT 'MAGENTA';
