import { INeonService, logger } from '../../common';
import { NeonEngine } from '../neon-core';
import { Logger } from 'winston';

export class RulesService implements INeonService {
  name: string;
  description: string;
  version: string;
  logger: Logger;

  constructor() {
    this.name = 'rules-service';
    this.description = 'Rules Service';
    this.version = 'v1.0.0';
    this.logger = logger.createLogger(this.name);
  }

  start(): Promise<boolean> {
    return Promise.resolve(true);
  }
  configure(_neonEngine: NeonEngine): Promise<boolean> {
    return Promise.resolve(true);
  }
}
