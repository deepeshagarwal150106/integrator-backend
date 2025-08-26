/*
  Warnings:

  - You are about to drop the column `actionMetaData` on the `Action` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Action" DROP COLUMN "actionMetaData",
ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';
