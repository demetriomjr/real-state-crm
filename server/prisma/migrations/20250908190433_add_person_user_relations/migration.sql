/*
  Warnings:

  - You are about to drop the column `address_line_1` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `address_line_2` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `district` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `zip_code` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `postal_code` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "address_line_1",
DROP COLUMN "address_line_2",
DROP COLUMN "district",
DROP COLUMN "zip_code",
ADD COLUMN     "postal_code" TEXT NOT NULL,
ADD COLUMN     "street" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "people" ADD COLUMN     "tenant_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "person_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "people"("id") ON DELETE SET NULL ON UPDATE CASCADE;
