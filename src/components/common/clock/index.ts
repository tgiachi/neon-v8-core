import { BaseComponent } from '../../../common/interfaces/base/base-component';
import { neonComponent } from '../../../common/decorators';
import { messagesHelper } from '../../../common';
import { NeonEngine } from '../../../services';

export interface IClockMessage {
  date: number;
  day: number;
  month: number;
  year: number;

  hours: number;
  minute: number;
  seconds: number;
}

@neonComponent('Clock', '1.0', 'clock')
export class ClockComponent extends BaseComponent {
  constructor() {
    super();
    this.initVersion(ClockComponent.prototype);
  }

  start(_neonEngine: NeonEngine): Promise<boolean> {
    messagesHelper.buildSchedulerAddJob(
      'clock',
      '* * * * *',
      this.processClock.bind(this),
    );

    return Promise.resolve(true);
  }

  defaultConfig() {
    return { isEnabled: true };
  }

  loadConfig(_config: any) {
    //
  }

  processClock() {
    const currentDate = new Date();
    const clockMessage: IClockMessage = {
      date: Date.now(),
      hours: currentDate.getHours(),
      minute: currentDate.getMinutes(),
      seconds: currentDate.getSeconds(),
      year: currentDate.getFullYear(),
      day: currentDate.getDay(),
      month: currentDate.getMonth(),
    };
    messagesHelper.buildEvent(this.serviceName, clockMessage);
  }
}
