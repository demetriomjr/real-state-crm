-- AlterTable
ALTER TABLE "public"."contacts" ADD COLUMN     "contact_name" TEXT,
ADD COLUMN     "is_whatsapp" BOOLEAN DEFAULT false;
