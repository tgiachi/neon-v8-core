import { BaseComponent } from '../../../common/interfaces/base/base-component';
import { neonComponent } from '../../../common/decorators';
import { messagesHelper } from '../../../common';
@neonComponent('Clock', '1.0', 'clock')
export class ClockComponent extends BaseComponent {
  constructor() {
    super();
    this.initVersion(ClockComponent.prototype);
  }

  start(_neonEngine: NeonEngine):Promise<boolean> {
    messagesHelper.buildSchedulerAddJob(
      'clock',
      '* * * * *',
      this.processClock.bind(this),
    );

    return Promise.resolve(true);

  }
  processClock() {
    console.log("");
  }
}
