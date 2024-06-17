/*
  Warnings:

  - Added the required column `endereco` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `professor` ADD COLUMN `endereco` VARCHAR(191) NOT NULL;
