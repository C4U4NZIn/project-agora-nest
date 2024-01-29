import { Module } from '@nestjs/common';

import { UserModule } from './user/user.module';

import { PrismaModule } from './prisma.module';

import { AuthModule } from './Auth/auth.module';

import { APP_GUARD } from '@nestjs/core';

import { JwtAuthGuard } from './Auth/guards/jwt-auth.guard';



@Module({
  imports: [PrismaModule , UserModule , AuthModule],
  providers:[
    {
      provide:APP_GUARD,
      useClass:JwtAuthGuard,
    }
  ]
})
export class AppModule {}

