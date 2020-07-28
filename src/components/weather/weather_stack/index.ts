import { BaseComponent } from '../../../common/interfaces/base/base-component';
import { neonComponent } from '../../../common/decorators';
import * as weather from 'openweather-apis';
import { NeonEngine } from '../../../services';
import { Logger } from 'winston';
import { logger, messagesHelper } from '../../../common';

@neonComponent('Weather Stack', '1.0', 'weather-stack')
export class WeatherStackComponent extends BaseComponent {
  private apiKey: string;
  private city: string;
  private logger: Logger;

  constructor() {
    super();
    this.initVersion(WeatherStackComponent.prototype);
    this.logger = logger.createLogger(this.serviceName);
  }
  defaultConfig() {
    return {
      isEnabled: false,
      api_key: '',
      city: '',
    };
  }
  loadConfig(config: any) {
    this.apiKey = config.api_key;
    this.city = config.city;
    this.logger.info('Weather component is ready');
  }
  async start(_neonEngine: NeonEngine): Promise<boolean> {
    messagesHelper.buildSchedulerAddJob(
      this.serviceName,
      '*/5 * * * *',
      this.getWeatherInformations.bind(this),
    );
    weather.setLang('it');
    weather.setCity(this.city);
    weather.setAPPID(this.apiKey);

    return true;
  }

  private getWeatherInformations() {
    weather.getAllWeather((_err, result) => {
      console.log(result);
    });
  }
}
