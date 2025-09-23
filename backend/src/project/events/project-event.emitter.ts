import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SecretsUpdatedEvent } from './definitions/secrets-updated.event';
import { ProjectEvent } from './project-events.enum';

@Injectable()
export class ProjectEventEmitter {
  public constructor(private readonly eventEmitter: EventEmitter2) {}

  public secretsUpdated(payload: SecretsUpdatedEvent): void {
    this.eventEmitter.emit(ProjectEvent.SecretsUpdated, payload);
  }
}
