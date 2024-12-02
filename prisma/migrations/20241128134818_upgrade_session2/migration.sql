/*
  Warnings:

  - The primary key for the `session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `session` table. All the data in the column will be lost.
  - Added the required column `sid` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "session" DROP CONSTRAINT "session_pkey",
DROP COLUMN "id",
ADD COLUMN     "sid" TEXT NOT NULL,
ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid");
