/*
  Warnings:

  - You are about to drop the column `deviceName` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `deviceType` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `ipAdress` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `lastActive` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `session` table. All the data in the column will be lost.
  - Added the required column `device_name` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `device_type` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ip_adress` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_active` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- AlterTable
ALTER TABLE "session" DROP COLUMN "deviceName",
DROP COLUMN "deviceType",
DROP COLUMN "ipAdress",
DROP COLUMN "isActive",
DROP COLUMN "lastActive",
DROP COLUMN "userId",
ADD COLUMN     "device_name" TEXT NOT NULL,
ADD COLUMN     "device_type" TEXT NOT NULL,
ADD COLUMN     "ip_adress" TEXT NOT NULL,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "last_active" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
