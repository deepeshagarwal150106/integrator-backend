/*
  Warnings:

  - You are about to drop the column `metaData` on the `ZapRun` table. All the data in the column will be lost.
  - Added the required column `actionMetaData` to the `Action` table without a default value. This is not possible if the table is not empty.
  - Added the required column `triggerMetaData` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Action" ADD COLUMN     "actionMetaData" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "Trigger" ADD COLUMN     "triggerMetaData" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "ZapRun" DROP COLUMN "metaData";
