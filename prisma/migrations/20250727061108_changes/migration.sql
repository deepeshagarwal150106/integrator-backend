/*
  Warnings:

  - You are about to drop the column `triggerMetaData` on the `Trigger` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "triggerMetaData",
ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}';
