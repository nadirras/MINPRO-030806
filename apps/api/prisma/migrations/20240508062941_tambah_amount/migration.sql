/*
  Warnings:

  - Added the required column `amount` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `payment` ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `discountId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_discountId_fkey` FOREIGN KEY (`discountId`) REFERENCES `DiscountVoucher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
