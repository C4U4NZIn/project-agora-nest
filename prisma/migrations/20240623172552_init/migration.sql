/*
  Warnings:

  - The primary key for the `questao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `questao` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - A unique constraint covering the columns `[postId]` on the table `Simulado` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `idSimulado` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Simulado` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `comment` ADD COLUMN `createAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expiresAt` TIMESTAMP(3) NULL,
    ADD COLUMN `updateAt` TIMESTAMP(3) NULL;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `createAt` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expiresAt` TIMESTAMP(3) NULL,
    ADD COLUMN `idSimulado` INTEGER NOT NULL,
    ADD COLUMN `updateAt` TIMESTAMP(3) NULL;

-- AlterTable
ALTER TABLE `questao` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `simulado` ADD COLUMN `postId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Turma_Alunos` (
    `idAluno` VARCHAR(191) NOT NULL,
    `idTurma` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idAluno`, `idTurma`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Simulado_postId_key` ON `Simulado`(`postId`);

-- AddForeignKey
ALTER TABLE `Simulado` ADD CONSTRAINT `Simulado_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turma_Alunos` ADD CONSTRAINT `Turma_Alunos_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `Aluno`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turma_Alunos` ADD CONSTRAINT `Turma_Alunos_idTurma_fkey` FOREIGN KEY (`idTurma`) REFERENCES `Turma`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
