import { neonComponent } from '../../../common/decorators';
import { BaseComponent } from '../../../common/interfaces/base/base-component';
import { NeonEngine } from '../../../services';
import { Logger } from 'winston';
import { logger } from '../../../common';
import { ComfortCloudClient } from 'panasonic-comfort-cloud-client';

@neonComponent('Panasonic Air', '1.0', 'panasonic-air')
export class PanasonicAirComponent extends BaseComponent {
  private logger: Logger;
  private username: string;
  private password: string;
  private client: ComfortCloudClient;
  constructor() {
    super();
    this.initVersion(PanasonicAirComponent.prototype);
    this.logger = logger.createLogger(this.serviceName);
  }

  loadConfig(config: any) {
    this.username = config.username;
    this.password = config.password;
  }

  async start(_neonEngine: NeonEngine): Promise<boolean> {
    this.client = new ComfortCloudClient();
    const token = await this.client.login(this.username, this.username);
    this.logger.info("TOKEN");
    this.logger.info(token);
    return true;
  }

  defaultConfig() {
    return {
      isEnabled: false,
      username: '',
      password: '',
    };
  }
}
