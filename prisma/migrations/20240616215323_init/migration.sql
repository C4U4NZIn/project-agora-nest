/*
  Warnings:

  - Made the column `telefone` on table `aluno` required. This step will fail if there are existing NULL values in that column.
  - Made the column `parent_name` on table `aluno` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefone_parent_1` on table `aluno` required. This step will fail if there are existing NULL values in that column.
  - Made the column `telefone_parent_2` on table `aluno` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `aluno` MODIFY `telefone` VARCHAR(191) NOT NULL,
    MODIFY `parent_name` VARCHAR(191) NOT NULL,
    MODIFY `telefone_parent_1` VARCHAR(191) NOT NULL,
    MODIFY `telefone_parent_2` VARCHAR(191) NOT NULL;
