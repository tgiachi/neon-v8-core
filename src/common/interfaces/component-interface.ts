import { NeonEngine } from '../../services';

export interface INeonComponent {
  name: string;
  version: string;
  serviceName: string;
  defaultConfig(): any;
  loadConfig(config: any): any;
  start(neonEngine: NeonEngine): Promise<boolean>;
}
