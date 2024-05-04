/*
  Warnings:

  - You are about to drop the column `nama` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `myreferralCode` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `jenis_kelamin` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tanggal_lahir` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nomor_telepon` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `photo_profile` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `role` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `nama`,
    ADD COLUMN `myreferralCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `points` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `usedReferralCode` VARCHAR(191) NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL,
    MODIFY `jenis_kelamin` ENUM('Laki_laki', 'Perempuan') NOT NULL,
    MODIFY `tanggal_lahir` DATETIME(3) NOT NULL,
    MODIFY `nomor_telepon` VARCHAR(191) NOT NULL,
    MODIFY `photo_profile` VARCHAR(191) NOT NULL,
    MODIFY `role` ENUM('Pembeli', 'Event_Organizer') NOT NULL;

-- CreateTable
CREATE TABLE `DiscountCoupon` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `discount` INTEGER NOT NULL DEFAULT 10,
    `expiresAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_username_key` ON `User`(`username`);

-- AddForeignKey
ALTER TABLE `DiscountCoupon` ADD CONSTRAINT `DiscountCoupon_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
