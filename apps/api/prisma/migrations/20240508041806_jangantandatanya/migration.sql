/*
  Warnings:

  - Made the column `eventDate` on table `event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `location` on table `event` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `event` MODIFY `eventDate` DATETIME(3) NOT NULL,
    MODIFY `description` VARCHAR(191) NOT NULL,
    MODIFY `location` VARCHAR(191) NOT NULL;
