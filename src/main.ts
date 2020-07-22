import { MqttService, DatabaseService, SchedulerService } from './services/';
import { logger, defaultConfig } from './common';
import { ApiService } from './services/api';
import { NeonEngine } from './services';

const log = logger.createLogger('neon-service');

const neonEngine = new NeonEngine({
  services: [
    new DatabaseService(),
    new MqttService('http://test.mosquitto.org'),
    new SchedulerService(),
    new ApiService(),
  ],
});
log.log('info', `config: ${JSON.stringify(defaultConfig)} `);

neonEngine.start();
