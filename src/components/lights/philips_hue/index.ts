import { neonComponent } from '../../../common/decorators';
import { BaseComponent } from '../../../common/interfaces/base/base-component';
import { NeonEngine } from '../../../services';
import { v3 } from 'node-hue-api';
import { Logger } from 'winston';
import { logger } from '../../../common';
@neonComponent('Philips Hue', '1.0', 'philips-hue')
export class PhilipsHueComponent extends BaseComponent {
  private logger: Logger;
  constructor() {
    super();
    this.initVersion(PhilipsHueComponent.prototype);
    this.logger = logger.createLogger(this.serviceName);
  }

  loadConfig(_config: any) {
    return '';
  }

  async start(_neonEngine: NeonEngine): Promise<boolean> {
    const result = await v3.discovery.nupnpSearch();

    console.log(result);
    this.logger.info(result);

    return true;
  }

  defaultConfig() {
    return {
      isEnabled: false,
    };
  }
}
