import { NeonEngine } from '../../services';

export interface INeonService {
  name: string;
  description: string;
  version: string;
  start(): Promise<boolean>;
  configure(neonEngine: NeonEngine): Promise<boolean>;
  exportedContext(): any;
}
