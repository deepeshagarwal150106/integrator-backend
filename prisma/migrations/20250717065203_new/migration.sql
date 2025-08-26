/*
  Warnings:

  - You are about to drop the column `userId` on the `Zap` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Zap` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Zap" DROP CONSTRAINT "Zap_userId_fkey";

-- AlterTable
ALTER TABLE "Zap" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Zap" ADD CONSTRAINT "Zap_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
