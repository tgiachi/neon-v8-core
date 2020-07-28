import {
  MqttService,
  DatabaseService,
  SchedulerService,
  EventService,
  RulesService,
} from './services/';
import { logger, defaultConfig } from './common';
import { ApiService } from './services/api';
import { NeonEngine } from './services';
import { DummyComponent, OwntrackComponent } from './components';
import { ScriptManagerService } from './services/scriptmanager';
import { ClockComponent } from './components/common/clock';
import { TelegramBotComponent } from './components/messaging/telegram';
import { SpotifyComponent } from './components/entertainment/spotify';
import { PhilipsHueComponent } from './components/lights/philips_hue';

const log = logger.createLogger('neon-service');

const neonEngine = new NeonEngine({
  services: [
    new DatabaseService(),
    new EventService(),
    new MqttService(defaultConfig.mqttServer),
    new SchedulerService(),
    new ScriptManagerService(),
    new RulesService(),
    new ApiService(),
  ],
  components: [
    new DummyComponent(),
    new OwntrackComponent(),
    new ClockComponent(),
    new TelegramBotComponent(),
    new SpotifyComponent(),
    new PhilipsHueComponent()
  ],
});
log.log('info', `config: ${JSON.stringify(defaultConfig)} `);

neonEngine.start();
