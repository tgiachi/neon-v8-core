import { Logger } from 'winston';
import { logger } from '../../common/';

export class MqttService {
  private hostname: string;
  private logger: Logger;

  constructor(hostname: string) {
    this.hostname = hostname;
    this.logger = logger.createLogger('mqttService');
  }

  public connect(): void {
    this.logger.log('info', 'Connect to MQTT %O ', this.hostname);
  }
}
