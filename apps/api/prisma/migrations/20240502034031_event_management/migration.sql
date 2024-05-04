-- AlterTable
ALTER TABLE `User` MODIFY `jenis_kelamin` ENUM('Laki_laki', 'Perempuan') NULL,
    MODIFY `tanggal_lahir` DATETIME(3) NULL,
    MODIFY `nomor_telepon` VARCHAR(191) NULL,
    MODIFY `photo_profile` VARCHAR(191) NULL,
    MODIFY `role` VARCHAR(191) NULL DEFAULT 'Pembeli';
