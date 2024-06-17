/*
  Warnings:

  - Added the required column `subject` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `professor` ADD COLUMN `subject` VARCHAR(191) NOT NULL;
