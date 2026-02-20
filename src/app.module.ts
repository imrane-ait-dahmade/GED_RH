import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { DocumentsModule } from './documents/documents.module';
import { CandidatesModule } from './candidates/candidates.module';
import { FormsModule } from './forms/forms.module';
import { InterviewsModule } from './interviews/interviews.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3000),
        DATABASE_URL: Joi.string().uri().required(),
        MINIO_ENDPOINT: Joi.string().default('minio:9000'),
        MINIO_ACCESS_KEY: Joi.string().required(),
        MINIO_SECRET_KEY: Joi.string().required(),
        MINIO_BUCKET: Joi.string().default('gedpro'),
      }),
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    OrganizationsModule,
    DocumentsModule,
    CandidatesModule,
    FormsModule,
    InterviewsModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
