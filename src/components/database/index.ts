import { Logger } from 'winston';
import { logger, INeonService } from '../../common';
import {
  subscribeMessageToBus,
  EventBusMessageType,
} from '../../common/eventbus';
export class DatabaseService implements INeonService {
  private logger: Logger;
  name: string;
  version: string;
  constructor() {
    this.name = 'Database Service';
    this.version = 'v1.0.0';
    this.logger = logger.createLogger('database-service');
    subscribeMessageToBus(EventBusMessageType.APPLICATION_READY, {
      callback: (type, payload) => {
        console.log(`${type} => ${payload}`);
      },
    });
  }
  async configure(): Promise<boolean> {
    return true;
  }

  public async start(): Promise<boolean> {
    this.logger.log('info', 'Starting database service');
    return true;
  }
}
