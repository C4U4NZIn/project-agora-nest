-- CreateTable
CREATE TABLE `address` (
    `id` VARCHAR(191) NOT NULL,
    `cep` VARCHAR(191) NOT NULL,
    `numberHouse` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NOT NULL,
    `estado` VARCHAR(191) NOT NULL,
    `cidade` VARCHAR(191) NOT NULL,
    `country` VARCHAR(191) NOT NULL,
    `logradouro` VARCHAR(191) NULL,
    `complemento` VARCHAR(191) NULL,
    `idAluno` VARCHAR(191) NULL,
    `idCoordenador` VARCHAR(191) NULL,
    `idProfessor` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_password_key`(`password`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `filiacao` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `tipo_Relacionamento` VARCHAR(191) NOT NULL,
    `telefone1` VARCHAR(191) NULL,
    `telefone2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Aluno` (
    `id` VARCHAR(191) NOT NULL,
    `avatar` LONGBLOB NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailInstitutional` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `matricula` VARCHAR(191) NOT NULL,
    `turma` VARCHAR(191) NOT NULL,
    `idFiliacao` VARCHAR(191) NULL,

    UNIQUE INDEX `Aluno_email_key`(`email`),
    UNIQUE INDEX `Aluno_emailInstitutional_key`(`emailInstitutional`),
    UNIQUE INDEX `Aluno_password_key`(`password`),
    UNIQUE INDEX `Aluno_matricula_key`(`matricula`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coordenador` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `avatar` LONGBLOB NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `phonePersonal` VARCHAR(191) NOT NULL,
    `phoneInstitutional` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailInstitutional` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Coordenador_password_key`(`password`),
    UNIQUE INDEX `Coordenador_email_key`(`email`),
    UNIQUE INDEX `Coordenador_emailInstitutional_key`(`emailInstitutional`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Professor` (
    `id` VARCHAR(191) NOT NULL,
    `avatar` LONGBLOB NULL,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `emailInstitutional` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `cpf` VARCHAR(191) NULL,
    `titulacao` VARCHAR(191) NOT NULL,
    `telefone1` VARCHAR(191) NOT NULL,
    `telefone2` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Professor_email_key`(`email`),
    UNIQUE INDEX `Professor_emailInstitutional_key`(`emailInstitutional`),
    UNIQUE INDEX `Professor_password_key`(`password`),
    UNIQUE INDEX `Professor_telefone1_key`(`telefone1`),
    UNIQUE INDEX `Professor_telefone2_key`(`telefone2`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Posts` (
    `id` VARCHAR(191) NOT NULL,
    `idProfessor` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Turmas` (
    `id` VARCHAR(191) NOT NULL,
    `idCoordenador` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Turmas_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Salas` (
    `id` VARCHAR(191) NOT NULL,
    `avatar` LONGBLOB NULL,
    `idTurma` VARCHAR(191) NOT NULL,
    `idProfessor` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Salas_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Questao` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(200) NOT NULL,
    `text` LONGTEXT NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `imageUrl` LONGBLOB NULL,
    `alternativa1` LONGTEXT NULL,
    `alternativa2` LONGTEXT NULL,
    `alternativa3` LONGTEXT NULL,
    `alternativa4` LONGTEXT NULL,
    `alternativa5` LONGTEXT NULL,
    `resposta` LONGTEXT NULL,
    `idQuiz` VARCHAR(191) NOT NULL,
    `idProfessor` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Quiz` (
    `id` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `qtdQuestao` INTEGER NOT NULL,
    `idProfessor` VARCHAR(191) NOT NULL,
    `idAluno` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OtpUser` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `otpCode` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `OtpUser_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Salas_Alunos` (
    `idAluno` VARCHAR(191) NOT NULL,
    `idSala` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`idAluno`, `idSala`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `Aluno`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_idCoordenador_fkey` FOREIGN KEY (`idCoordenador`) REFERENCES `Coordenador`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `Professor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Aluno` ADD CONSTRAINT `Aluno_idFiliacao_fkey` FOREIGN KEY (`idFiliacao`) REFERENCES `filiacao`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Posts` ADD CONSTRAINT `Posts_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Turmas` ADD CONSTRAINT `Turmas_idCoordenador_fkey` FOREIGN KEY (`idCoordenador`) REFERENCES `Coordenador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas` ADD CONSTRAINT `Salas_idTurma_fkey` FOREIGN KEY (`idTurma`) REFERENCES `Turmas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas` ADD CONSTRAINT `Salas_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `Professor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questao` ADD CONSTRAINT `Questao_idQuiz_fkey` FOREIGN KEY (`idQuiz`) REFERENCES `Quiz`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questao` ADD CONSTRAINT `Questao_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_idProfessor_fkey` FOREIGN KEY (`idProfessor`) REFERENCES `Professor`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Quiz` ADD CONSTRAINT `Quiz_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `Aluno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas_Alunos` ADD CONSTRAINT `Salas_Alunos_idAluno_fkey` FOREIGN KEY (`idAluno`) REFERENCES `Aluno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Salas_Alunos` ADD CONSTRAINT `Salas_Alunos_idSala_fkey` FOREIGN KEY (`idSala`) REFERENCES `Salas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
