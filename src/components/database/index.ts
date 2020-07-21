import { Logger } from 'winston';
import { logger } from '../../common';
export class DatabaseService {
  private logger: Logger;
  constructor() {
    this.logger = logger.createLogger('database-service');
  }

  public start(): void {
    this.logger.log('info', 'Starting database service');
  }
}
