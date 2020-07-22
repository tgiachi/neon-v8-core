import { MqttService, DatabaseService, SchedulerService, EventService } from './services/';
import { logger, defaultConfig } from './common';
import { ApiService } from './services/api';
import { NeonEngine } from './services';
import { DummyComponent, OwntrackComponent } from './components';

const log = logger.createLogger('neon-service');

const neonEngine = new NeonEngine({
  services: [
    new DatabaseService(),
    new EventService(),
    new MqttService(defaultConfig.mqttServer),
    new SchedulerService(),
    new ApiService(),
  ],
  components: [
    new DummyComponent(),
    new OwntrackComponent()
  ]
});
log.log('info', `config: ${JSON.stringify(defaultConfig)} `);

neonEngine.start();
