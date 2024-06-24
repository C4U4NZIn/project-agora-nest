/*
  Warnings:

  - Added the required column `name_instituicao` to the `Coordenador` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aluno` ADD COLUMN `parent2_endereco` VARCHAR(191) NULL,
    ADD COLUMN `parent2_name` VARCHAR(191) NULL,
    ADD COLUMN `parent_endereco` VARCHAR(191) NULL,
    ADD COLUMN `telefone_parent2_1` VARCHAR(191) NULL,
    ADD COLUMN `telefone_parent2_2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `coordenador` ADD COLUMN `name_instituicao` VARCHAR(191) NOT NULL;
