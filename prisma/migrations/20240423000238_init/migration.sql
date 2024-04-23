/*
  Warnings:

  - You are about to drop the column `idFiliacao` on the `aluno` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `aluno` DROP FOREIGN KEY `Aluno_idFiliacao_fkey`;

-- AlterTable
ALTER TABLE `aluno` DROP COLUMN `idFiliacao`;
