import { Module } from '@nestjs/common';
import { ProjectEventEmitter } from './project-event.emitter';

@Module({
  providers: [ProjectEventEmitter],
  exports: [ProjectEventEmitter],
})
export class ProjectEventModule {}
