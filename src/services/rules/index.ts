import {
  INeonService,
  logger,
  subscribeMessageToBus,
  EventBusMessageType,
} from '../../common';
import { NeonEngine } from '../neon-core';
import { Logger } from 'winston';
import { Engine } from 'json-rules-engine';

export class RulesService implements INeonService {
  name: string;
  description: string;
  version: string;
  logger: Logger;
  ruleEngine: Engine;

  constructor() {
    this.name = 'rules-service';
    this.description = 'Rules Service';
    this.version = 'v1.0.0';
    this.logger = logger.createLogger(this.name);
    this.ruleEngine = new Engine();
  }

  start(): Promise<boolean> {
    return Promise.resolve(true);
  }
  configure(_neonEngine: NeonEngine): Promise<boolean> {
    subscribeMessageToBus(EventBusMessageType.SERVICE_EVENT_RECEIVED, {
      callback: this.processEvents.bind(this),
    });
    return Promise.resolve(true);
  }

  private async processEvents(_type: EventBusMessageType, payload: any) {
    this.logger.info(`Processing event: ${payload.component}`);
    await this.ruleEngine.run(payload);
    // console.log(results);
  }

  addRule(rule: any) {
    this.ruleEngine.addRule(rule);
  }
}
