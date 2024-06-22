/*
  Warnings:

  - You are about to drop the column `name_sala` on the `salas` table. All the data in the column will be lost.
  - You are about to drop the `comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `quiz` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[sala_name]` on the table `Salas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sala_name` to the `Salas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `post` DROP FOREIGN KEY `Post_idProfessor_fkey`;

-- DropForeignKey
ALTER TABLE `questao` DROP FOREIGN KEY `Questao_idProfessor_fkey`;

-- DropForeignKey
ALTER TABLE `questao` DROP FOREIGN KEY `Questao_idQuiz_fkey`;

-- DropForeignKey
ALTER TABLE `quiz` DROP FOREIGN KEY `Quiz_idAluno_fkey`;

-- DropForeignKey
ALTER TABLE `quiz` DROP FOREIGN KEY `Quiz_idProfessor_fkey`;

-- DropForeignKey
ALTER TABLE `salas` DROP FOREIGN KEY `Salas_coordenadorId_fkey`;

-- DropForeignKey
ALTER TABLE `salas` DROP FOREIGN KEY `Salas_professorId_fkey`;

-- DropForeignKey
ALTER TABLE `salas` DROP FOREIGN KEY `Salas_turmaId_fkey`;

-- DropForeignKey
ALTER TABLE `salas_alunos` DROP FOREIGN KEY `Salas_Alunos_idAluno_fkey`;

-- DropForeignKey
ALTER TABLE `salas_alunos` DROP FOREIGN KEY `Salas_Alunos_idSala_fkey`;

-- DropForeignKey
ALTER TABLE `turma` DROP FOREIGN KEY `Turma_idCoordenador_fkey`;

-- DropIndex
DROP INDEX `Salas_name_sala_key` ON `salas`;

-- AlterTable
ALTER TABLE `post` ADD COLUMN `type` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `salas` DROP COLUMN `name_sala`,
    ADD COLUMN `sala_name` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `comments`;

-- DropTable
DROP TABLE `quiz`;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `isPrivate` BOOLEAN NULL,
    `content` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `alunoId` VARCHAR(191) NOT NULL,
    `professorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Simulado` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `qtdQuestao` VARCHAR(191) NOT NULL,
    `idProfessor` VARCHAR(191) NOT NULL,
    `salaId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Score` (
    `id` VARCHAR(191) NOT NULL,
    `student_score` INTEGER NULL,
    `idQuiz` VARCHAR(191) NOT NULL,
    `alunoId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `desempenho` (
    `id` VARCHAR(191) NOT NULL,
    `alunoId` VARCHAR(191) NOT NULL,
    `simuladoId` VARCHAR(191) NOT NULL,
    `matematica_correct_answers` INTEGER NULL,
    `portugues_correct_answers` INTEGER NULL,
    `fisica_correct_answers` INTEGER NULL,
    `quimica_correct_answers` INTEGER NULL,
    `biologia_correct_answers` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Salas_sala_name_key` ON `Salas`(`sala_name`);

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `Professor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turma` ADD CONSTRAINT `Turma_idCoordenador_fkey` FOREIGN KEY (`idCoordenador`) REFERENCES `Coordenador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas` ADD CONSTRAINT `Salas_turmaId_fkey` FOREIGN KEY (`turmaId`) REFERENCES `Turma`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas` ADD CONSTRAINT `Salas_coordenadorId_fkey` FOREIGN KEY (`coordenadorId`) REFERENCES `Coordenador`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas` ADD CONSTRAINT `Salas_professorId_fkey` FOREIGN KEY (`professorId`) REFERENCES `Professor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questao` ADD CONSTRAINT `Questao_idQuiz_fkey` FOREIGN KEY (`idQuiz`) REFERENCES `Simulado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questao` ADD CONSTRAINT `Questao_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `Professor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulado` ADD CONSTRAINT `Simulado_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `Professor`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Simulado` ADD CONSTRAINT `Simulado_salaId_fkey` FOREIGN KEY (`salaId`) REFERENCES `Salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_idQuiz_fkey` FOREIGN KEY (`idQuiz`) REFERENCES `Simulado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Score` ADD CONSTRAINT `Score_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `desempenho` ADD CONSTRAINT `desempenho_alunoId_fkey` FOREIGN KEY (`alunoId`) REFERENCES `Aluno`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `desempenho` ADD CONSTRAINT `desempenho_simuladoId_fkey` FOREIGN KEY (`simuladoId`) REFERENCES `Simulado`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas_Alunos` ADD CONSTRAINT `Salas_Alunos_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `Aluno`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas_Alunos` ADD CONSTRAINT `Salas_Alunos_idSala_fkey` FOREIGN KEY (`idSala`) REFERENCES `Salas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
