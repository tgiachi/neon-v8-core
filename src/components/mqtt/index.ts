import { Logger } from 'winston';
import { logger, INeonService } from '../../common/';

export class MqttService implements INeonService {
  private hostname: string;
  private logger: Logger;

  constructor(hostname: string) {
    this.hostname = hostname;
    this.logger = logger.createLogger('mqttService');
  }

  public async start(): Promise<boolean> {
    this.logger.log('info', 'Connect to MQTT %O ', this.hostname);

    return true;
  }
}
