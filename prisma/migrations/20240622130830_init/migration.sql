/*
  Warnings:

  - You are about to drop the column `idProfessor` on the `salas` table. All the data in the column will be lost.
  - You are about to drop the column `idTurma` on the `salas` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `salas` table. All the data in the column will be lost.
  - You are about to drop the `turmas` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name_sala]` on the table `Salas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name_sala` to the `Salas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `turmaId` to the `Salas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `salas` DROP FOREIGN KEY `Salas_idProfessor_fkey`;

-- DropForeignKey
ALTER TABLE `salas` DROP FOREIGN KEY `Salas_idTurma_fkey`;

-- DropForeignKey
ALTER TABLE `turmas` DROP FOREIGN KEY `Turmas_idCoordenador_fkey`;

-- DropIndex
DROP INDEX `Salas_name_key` ON `salas`;

-- AlterTable
ALTER TABLE `comments` ADD COLUMN `content` VARCHAR(191) NOT NULL,
    ADD COLUMN `isPrivate` BOOLEAN NULL;

-- AlterTable
ALTER TABLE `salas` DROP COLUMN `idProfessor`,
    DROP COLUMN `idTurma`,
    DROP COLUMN `name`,
    ADD COLUMN `coordenadorId` VARCHAR(191) NULL,
    ADD COLUMN `name_sala` VARCHAR(191) NOT NULL,
    ADD COLUMN `professorId` VARCHAR(191) NULL,
    ADD COLUMN `turmaId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `turmas`;

-- CreateTable
CREATE TABLE `Turma` (
    `id` VARCHAR(191) NOT NULL,
    `idCoordenador` VARCHAR(191) NOT NULL,
    `turma_name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Turma_turma_name_key`(`turma_name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Salas_name_sala_key` ON `Salas`(`name_sala`);

-- AddForeignKey
ALTER TABLE `Turma` ADD CONSTRAINT `Turma_idCoordenador_fkey` FOREIGN KEY (`idCoordenador`) REFERENCES `Coordenador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas` ADD CONSTRAINT `Salas_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turma`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas` ADD CONSTRAINT `Salas_coordenadorId_fkey` FOREIGN KEY (`coordenadorId`) REFERENCES `Coordenador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas` ADD CONSTRAINT `Salas_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
