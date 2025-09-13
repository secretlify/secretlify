import { ValidationPipe } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getModelToken } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Test, TestingModule } from '@nestjs/testing';
import { clear } from 'jest-date-mock';
import { Model } from 'mongoose';
import * as nock from 'nock';
import { LogdashModule } from '../../src/shared/logdash/logdash.module';
import { UserEntity } from '../../src/user/core/entities/user.entity';
import { UserCoreModule } from '../../src/user/core/user-core.module';
import { AuthCoreModule } from './../../src/auth/core/auth-core.module';
import { closeInMemoryMongoServer, rootMongooseTestModule } from './mongo-in-memory-server';
import { UserUtils } from './user.utils';

export async function createTestApp() {
  const module: TestingModule = await Test.createTestingModule({
    imports: [
      rootMongooseTestModule(),
      AuthCoreModule,
      UserCoreModule,
      ScheduleModule.forRoot(),
      EventEmitterModule.forRoot(),
      LogdashModule,
    ],
  }).compile();

  const app = module.createNestApplication();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.init();

  const userModel: Model<UserEntity> = module.get(getModelToken(UserEntity.name));

  const clearDatabase = async () => {
    await Promise.all([userModel.deleteMany({})]);
  };

  const beforeEach = async () => {
    clear();
    await clearDatabase();
    nock.cleanAll();
  };

  const afterAll = async () => {
    await app.close();
    await closeInMemoryMongoServer();
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
    },
    methods: {
      clearDatabase,
      beforeEach,
      afterAll,
    },
  };
}
