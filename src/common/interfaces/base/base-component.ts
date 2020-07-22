import { INeonComponent } from '../component-interface';

export class BaseComponent implements INeonComponent {
  start(): Promise<boolean> {
    throw new Error("Method not implemented.");
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
