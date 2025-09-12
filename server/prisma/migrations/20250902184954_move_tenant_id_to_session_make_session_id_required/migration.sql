/*
  Warnings:

  - You are about to drop the column `tenant_id` on the `chats` table. All the data in the column will be lost.
  - Made the column `session_id` on table `chats` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_tenant_id_fkey";

-- AlterTable
ALTER TABLE "chats" DROP COLUMN "tenant_id",
ALTER COLUMN "session_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "whatsapp_sessions"("session_id") ON DELETE CASCADE ON UPDATE CASCADE;
