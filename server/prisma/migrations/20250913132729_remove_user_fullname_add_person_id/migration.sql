/*
  Warnings:

  - You are about to drop the column `fullName` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."addresses" ADD COLUMN     "number" TEXT;

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "fullName";
