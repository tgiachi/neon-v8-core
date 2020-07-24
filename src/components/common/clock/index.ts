import { BaseComponent } from '../../../common/interfaces/base/base-component';
import { neonComponent } from '../../../common/decorators';
import { NeonEngine, SchedulerService } from '../../../services';
@neonComponent('Clock', '1.0', 'clock')
export class ClockComponent extends BaseComponent {
  constructor() {
    super();
    this.initVersion(ClockComponent.prototype);
  }

  start(_neonEngine: NeonEngine):Promise<boolean> {
    const schedulerService = _neonEngine.resolveService('scheduler-service') as SchedulerService;

    return Promise.resolve(true);

  }
}
