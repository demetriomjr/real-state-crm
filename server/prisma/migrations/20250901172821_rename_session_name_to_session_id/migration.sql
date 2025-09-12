/*
  Warnings:

  - You are about to drop the column `session_name` on the `chats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "chats" DROP COLUMN "session_name",
ADD COLUMN     "session_id" TEXT;
