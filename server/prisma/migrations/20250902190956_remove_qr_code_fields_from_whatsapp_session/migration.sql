/*
  Warnings:

  - You are about to drop the column `qr_code` on the `whatsapp_sessions` table. All the data in the column will be lost.
  - You are about to drop the column `qr_code_expires_at` on the `whatsapp_sessions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "whatsapp_sessions" DROP COLUMN "qr_code",
DROP COLUMN "qr_code_expires_at";
