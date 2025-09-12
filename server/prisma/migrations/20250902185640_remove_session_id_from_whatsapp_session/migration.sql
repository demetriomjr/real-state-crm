/*
  Warnings:

  - You are about to drop the column `session_id` on the `whatsapp_sessions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_session_id_fkey";

-- DropIndex
DROP INDEX "whatsapp_sessions_session_id_key";

-- AlterTable
ALTER TABLE "whatsapp_sessions" DROP COLUMN "session_id";

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "whatsapp_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
