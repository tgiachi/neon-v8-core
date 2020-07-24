import {
  INeonService,
  subscribeMessageToBus,
  sendMessageToBus,
  EventBusMessageType,
} from '../../common';
import { NeonEngine } from '../neon-core';
import { neonService } from '../../common/decorators';
import { DatabaseService } from '../database';

export class EventService implements INeonService {
  name: string;
  description: string;
  version: string;
  neonEngine: NeonEngine;
  constructor() {
    this.name = 'event-service';
    this.description = 'Events Service';
    this.version = 'v1.0.0';
  }
  start(): Promise<boolean> {
    subscribeMessageToBus(EventBusMessageType.SERVICE_EVENT_ADD, {
      callback: this.processAddEvent.bind(this),
    });
    return Promise.resolve(true);
  }
  configure(neonEngine: NeonEngine): Promise<boolean> {
    this.neonEngine = neonEngine;
    return Promise.resolve(true);
  }

  private processAddEvent(_eventType: EventBusMessageType, payload: any) {
    const rawRecord = payload.data;
    const record = { component: payload.component, ...rawRecord };
    sendMessageToBus(EventBusMessageType.SERVICE_DATABASE_PERSIST_DATA, {
      database: 'events',
      records: new Array(record),
    });

    const dbService = this.neonEngine.resolveService(
      'database-service',
    ) as DatabaseService;
    dbService.raplaceRecord(
      'entities',
      { component: payload.component },
      { component: payload.component, ...rawRecord},
    );

    sendMessageToBus(EventBusMessageType.SERVICE_EVENT_RECEIVED, record);
  }
}
