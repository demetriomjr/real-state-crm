/*
  Warnings:

  - You are about to drop the `whatsapp_sessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "whatsapp_sessions" DROP CONSTRAINT "whatsapp_sessions_tenant_id_fkey";

-- DropTable
DROP TABLE "whatsapp_sessions";
