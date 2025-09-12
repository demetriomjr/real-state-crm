/*
  Warnings:

  - You are about to drop the column `document_number` on the `people` table. All the data in the column will be lost.
  - You are about to drop the column `document_type` on the `people` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[domain]` on the table `businesses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username,tenant_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `domain` to the `businesses` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_username_key";

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "is_default" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "domain" TEXT;

-- Update existing businesses with generated domains
UPDATE "businesses" SET "domain" = LOWER(REPLACE(REPLACE(REPLACE("company_name", ' ', ''), '-', ''), '_', '')) || '_' || SUBSTRING("id", 1, 8) WHERE "domain" IS NULL;

-- Make domain NOT NULL after populating
ALTER TABLE "businesses" ALTER COLUMN "domain" SET NOT NULL;

-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "is_default" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "documents" ADD COLUMN     "is_default" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "people" DROP COLUMN "document_number",
DROP COLUMN "document_type";

-- CreateIndex
CREATE UNIQUE INDEX "businesses_domain_key" ON "businesses"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_tenant_id_key" ON "users"("username", "tenant_id");
