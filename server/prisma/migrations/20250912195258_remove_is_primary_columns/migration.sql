/*
  Warnings:

  - You are about to drop the column `is_primary` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `is_primary` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `is_primary` on the `documents` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."addresses" DROP COLUMN "is_primary";

-- AlterTable
ALTER TABLE "public"."contacts" DROP COLUMN "is_primary";

-- AlterTable
ALTER TABLE "public"."documents" DROP COLUMN "is_primary";
