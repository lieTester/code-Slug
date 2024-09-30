-- AlterTable
ALTER TABLE "Problem" ADD COLUMN     "dislike" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "like" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ProblemStatus" ADD COLUMN     "like" BOOLEAN;
