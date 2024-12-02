/*
  Warnings:

  - Added the required column `expire` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sess` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session" ADD COLUMN     "expire" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sess" JSONB NOT NULL;
