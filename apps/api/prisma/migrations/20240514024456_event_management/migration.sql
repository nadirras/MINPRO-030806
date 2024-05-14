/*
  Warnings:

  - You are about to drop the `UserRole` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventSlug]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `eventSlug` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `EventOrganizer` DROP FOREIGN KEY `EventOrganizer_userId_fkey`;

-- DropForeignKey
ALTER TABLE `UserRole` DROP FOREIGN KEY `UserRole_userId_fkey`;

-- AlterTable
ALTER TABLE `Event` ADD COLUMN `eventSlug` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `UserRole`;

-- CreateIndex
CREATE UNIQUE INDEX `Event_eventSlug_key` ON `Event`(`eventSlug`);
