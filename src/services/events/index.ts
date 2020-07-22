import {
  INeonService,
  subscribeMessageToBus,
  sendMessageToBus,
  EventBusMessageType,
} from '../../common';

export class EventService implements INeonService {
  name: string;
  description: string;
  version: string;
  constructor() {
    this.name = 'event-service';
    this.description = 'Events Service';
    this.version = 'v1.0.0';
  }
  start(): Promise<boolean> {
    subscribeMessageToBus(EventBusMessageType.SERVICE_EVENT_ADD, {
      callback: this.processAddEvent,
    });
    return Promise.resolve(true);
  }
  configure(): Promise<boolean> {
    return Promise.resolve(true);
  }

  private processAddEvent(_eventType: EventBusMessageType, payload: any) {
    const rawRecord = payload.data;
    const record = { component: payload.component, ...rawRecord };
    sendMessageToBus(EventBusMessageType.SERVICE_DATABASE_PERSIST_DATA, {
      database: 'events',
      records: new Array(record)
    });
  }
}
