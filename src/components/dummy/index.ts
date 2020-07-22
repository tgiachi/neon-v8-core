import { neonComponent } from '../../common/decorators';
import { BaseComponent } from '../../common/interfaces/base/base-component';

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
  async start(): Promise<boolean> {
    return true;
  }
}
