/*
  Warnings:

  - You are about to drop the column `platform` on the `Problem` table. All the data in the column will be lost.
  - You are about to drop the column `platformPath` on the `Problem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" DROP COLUMN "platform",
DROP COLUMN "platformPath",
ALTER COLUMN "frontEndId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL DEFAULT 'https://leetcode.com/problems/',
    "name" TEXT NOT NULL DEFAULT 'leetcode',
    "problemId" INTEGER NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Platform" ADD CONSTRAINT "Platform_problemId_fkey" FOREIGN KEY ("problemId") REFERENCES "Problem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
