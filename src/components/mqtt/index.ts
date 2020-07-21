import { Logger } from 'winston';
import { logger, INeonService } from '../../common/';

export class MqttService implements INeonService {
  private hostname: string;
  private logger: Logger;
  name: string;
  version: string;

  constructor(hostname: string) {
    this.name = "MQTT Service";
    this.version = "v1.0.0";
    this.hostname = hostname;
    this.logger = logger.createLogger('mqttService');
  }
  async configure(): Promise<boolean> {
    return true;
  }

  public async start(): Promise<boolean> {
    this.logger.log('info', `Connect to MQTT ${this.hostname}`);

    return true;
  }
}
