import {
  INeonService,
  logger,
  subscribeMessageToBus,
  EventBusMessageType,
  IRule,
} from '../../common';
import { NeonEngine } from '../neon-core';
import { Logger } from 'winston';
import { Engine, NestedCondition } from 'json-rules-engine';

export class RulesService implements INeonService {
  name: string;
  description: string;
  version: string;
  logger: Logger;
  ruleEngine: Engine;
  ruleCallbacks: Map<string, any> = new Map();

  constructor() {
    this.name = 'rules-service';
    this.description = 'Rules Service';
    this.version = 'v1.0.0';
    this.logger = logger.createLogger(this.name);
    this.ruleEngine = new Engine();
  }
  exportedContext() {
    return {
      rules: {
        addRule: this.addRule.bind(this),
      },
    };
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
    const results = await this.ruleEngine.run(payload);

    for (const evt of results.events) {
      if (this.ruleCallbacks.has(evt.type)) {
        this.ruleCallbacks.get(evt.type)(payload);
      }
    }
    // console.log(results);
  }

  addRule(rule: IRule, callback: any) {

    const flattedRules: NestedCondition[] = [];
    flattedRules.concat(
      rule.rules.map((value) => {
        return {
          fact: value.propertyName,
          operator: value.operator,
          value: value.value,
        };
      }),
    );

    this.ruleEngine.addRule({
      name: rule.ruleName,
      conditions: {
        all: [...flattedRules],
      },
      event: {
        type: rule.ruleName,
      },
    });

    this.ruleCallbacks.set(rule.ruleName, callback);
  }
}
