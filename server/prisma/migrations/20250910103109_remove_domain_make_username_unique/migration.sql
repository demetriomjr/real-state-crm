/*
  Warnings:

  - You are about to drop the column `domain` on the `businesses` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "businesses_domain_key";

-- DropIndex
DROP INDEX "users_username_tenant_id_key";

-- AlterTable
ALTER TABLE "businesses" DROP COLUMN "domain";

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
