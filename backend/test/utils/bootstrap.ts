import { Logger, Metrics } from '@logdash/js-sdk';
import { ValidationPipe } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getModelToken } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import * as nock from 'nock';
import { GithubAuthModule } from '../../src/auth/github/github-auth.module';
import { GoogleAuthModule } from '../../src/auth/google/google-auth.module';
import { ProjectCoreModule } from '../../src/project/core/project-core.module';
import { LogdashModule } from '../../src/shared/logdash/logdash.module';
import { UserEntity } from '../../src/user/core/entities/user.entity';
import { UserCoreModule } from '../../src/user/core/user-core.module';
import { AuthCoreModule } from './../../src/auth/core/auth-core.module';
import { LoggerMock } from './mocks/logger-mock';
import { MetricsMock } from './mocks/metrics-mock';
import { closeInMemoryMongoServer, rootMongooseTestModule } from './mongo-in-memory-server';
import { ProjectUtils } from './project.utils';
import { UserUtils } from './user.utils';

export async function createTestApp() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      rootMongooseTestModule(),
      UserCoreModule,
      ProjectCoreModule,
      ScheduleModule.forRoot(),
      EventEmitterModule.forRoot(),
      AuthCoreModule,
      LogdashModule,
      GoogleAuthModule,
      GithubAuthModule,
    ],
  })
    .overrideProvider(Logger)
    .useClass(LoggerMock)
    .overrideProvider(Metrics)
    .useClass(MetricsMock)
    .compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.init();

  const userModel: Model<UserEntity> = module.get(getModelToken(UserEntity.name));

  const clearDatabase = async () => {
    await Promise.all([userModel.deleteMany({})]);
  };

  const beforeEach = async () => {
    const { clear } = await import('jest-date-mock');
    clear();
    await clearDatabase();
    nock.cleanAll();
  };

  const afterAll = async () => {
    await app.close();
    await closeInMemoryMongoServer();
    const { clear } = await import('jest-date-mock');
    clear();
  };

  return {
    app,
    module,
    models: {
      userModel,
    },
    utils: {
      userUtils: new UserUtils(app),
      projectUtils: new ProjectUtils(app),
    },
    methods: {
      clearDatabase,
      beforeEach,
      afterAll,
    },
  };
}
