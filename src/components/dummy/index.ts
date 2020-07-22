import { neonComponent } from '../../common/decorators';
import { BaseComponent } from '../../common/interfaces/base/base-component';
import { NeonEngine } from '../../services';

@neonComponent('Dummy', 'v1.0.0', 'dummy_component')
export class DummyComponent extends BaseComponent {
  constructor() {
    super();
    this.initVersion(DummyComponent.prototype);
  }
  defaultConfig() {
    return { isEnabled: false };
  }
  loadConfig(config: any) {
    console.log(config);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async start(_neonEngine: NeonEngine): Promise<boolean> {
    return true;
  }
}
