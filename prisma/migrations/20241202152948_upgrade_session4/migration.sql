/*
  Warnings:

  - You are about to drop the column `expire` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `sess` on the `session` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "session" DROP COLUMN "expire",
DROP COLUMN "is_active",
DROP COLUMN "sess";
