/*
  Warnings:

  - Added the required column `tenant_id` to the `chats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "chats" DROP CONSTRAINT "chats_person_id_fkey";

-- AlterTable
ALTER TABLE "chats" ADD COLUMN     "tenant_id" TEXT NOT NULL,
ALTER COLUMN "person_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chats" ADD CONSTRAINT "chats_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
