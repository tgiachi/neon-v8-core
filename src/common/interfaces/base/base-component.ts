import { INeonComponent } from '../component-interface';
import { NeonEngine } from '../../../services';

export class BaseComponent implements INeonComponent {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  start(_neonEngine: NeonEngine): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  loadConfig(config: any) {
    throw new Error(` ${config} Method not implemented.`);
  }
  defaultConfig() {
    throw new Error('Method not implemented.');
  }

  name: string;
  version: string;
  serviceName: string;

  protected initVersion(prototype: any) {
    this.name = prototype.name;
    this.version = prototype.version;
    this.serviceName = prototype.serviceName;
  }
}
