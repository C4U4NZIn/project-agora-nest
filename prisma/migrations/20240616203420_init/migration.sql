/*
  Warnings:

  - You are about to drop the column `emailInstitutional` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `idFiliacao` on the `aluno` table. All the data in the column will be lost.
  - You are about to drop the column `emailInstitutional` on the `coordenador` table. All the data in the column will be lost.
  - You are about to drop the column `phoneInstitutional` on the `coordenador` table. All the data in the column will be lost.
  - You are about to drop the column `phonePersonal` on the `coordenador` table. All the data in the column will be lost.
  - You are about to drop the column `emailInstitutional` on the `professor` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `questao` table. All the data in the column will be lost.
  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `filiacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `posts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email_profissional]` on the table `Coordenador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cep]` on the table `Coordenador` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email_profissional]` on the table `Professor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cep` to the `Coordenador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_profissional` to the `Coordenador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Coordenador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone1` to the `Coordenador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone2` to the `Coordenador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email_profissional` to the `Professor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `address_idAluno_fkey`;

-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `address_idCoordenador_fkey`;

-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `address_idProfessor_fkey`;

-- DropForeignKey
ALTER TABLE `aluno` DROP FOREIGN KEY `Aluno_idFiliacao_fkey`;

-- DropForeignKey
ALTER TABLE `posts` DROP FOREIGN KEY `Posts_idProfessor_fkey`;

-- DropIndex
DROP INDEX `Aluno_emailInstitutional_key` ON `aluno`;

-- DropIndex
DROP INDEX `Coordenador_emailInstitutional_key` ON `coordenador`;

-- DropIndex
DROP INDEX `Professor_emailInstitutional_key` ON `professor`;

-- AlterTable
ALTER TABLE `aluno` DROP COLUMN `emailInstitutional`,
    DROP COLUMN `idFiliacao`,
    ADD COLUMN `parent_name` VARCHAR(191) NULL,
    ADD COLUMN `telefone_parent_1` VARCHAR(191) NULL,
    ADD COLUMN `telefone_parent_2` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `coordenador` DROP COLUMN `emailInstitutional`,
    DROP COLUMN `phoneInstitutional`,
    DROP COLUMN `phonePersonal`,
    ADD COLUMN `cep` VARCHAR(191) NOT NULL,
    ADD COLUMN `email_profissional` VARCHAR(191) NOT NULL,
    ADD COLUMN `endereco` VARCHAR(191) NOT NULL,
    ADD COLUMN `telefone1` VARCHAR(191) NOT NULL,
    ADD COLUMN `telefone2` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `professor` DROP COLUMN `emailInstitutional`,
    ADD COLUMN `email_profissional` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `questao` DROP COLUMN `imageUrl`,
    ADD COLUMN `imageBase64` LONGBLOB NULL;

-- AlterTable
ALTER TABLE `quiz` MODIFY `qtdQuestao` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `address`;

-- DropTable
DROP TABLE `filiacao`;

-- DropTable
DROP TABLE `posts`;

-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `idProfessor` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comments` (
    `id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Coordenador_email_profissional_key` ON `Coordenador`(`email_profissional`);

-- CreateIndex
CREATE UNIQUE INDEX `Coordenador_cep_key` ON `Coordenador`(`cep`);

-- CreateIndex
CREATE UNIQUE INDEX `Professor_email_profissional_key` ON `Professor`(`email_profissional`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
