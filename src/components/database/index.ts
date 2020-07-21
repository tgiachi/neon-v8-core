import { Logger } from 'winston';
import { logger, INeonService } from '../../common';
import { subscribeMessageToBus, EventBusMessageType } from '../../common/eventbus';
export class DatabaseService implements INeonService {
  private logger: Logger;
  constructor() {
    this.logger = logger.createLogger('database-service');
    subscribeMessageToBus(EventBusMessageType.APPLICATION_READY, {
      callback: (type, payload) => {
        console.log(`${type} => ${payload}`);
      },
    });
  }

  public async start(): Promise<boolean> {
    this.logger.log('info', 'Starting database service');
    return true;
  }
}
