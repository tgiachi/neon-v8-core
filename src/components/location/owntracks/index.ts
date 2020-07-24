import { BaseComponent } from '../../../common/interfaces/base/base-component';
import { neonComponent } from '../../../common/decorators';
import { NeonEngine } from '../../../services';
import { sendMessageToBus, EventBusMessageType } from '../../../common';

@neonComponent('OwnTracks', '1.0', 'owntracks')
export class OwntrackComponent extends BaseComponent {
  config: { isEnabled: string; topic: string };
  constructor() {
    super();
    this.initVersion(OwntrackComponent.prototype);
  }
  start(_neonEngine: NeonEngine): Promise<boolean> {
    return Promise.resolve(true);
  }
  loadConfig(config: any) {
    this.config = { isEnabled: config.isEnabled, topic: config.topic };
    sendMessageToBus(EventBusMessageType.MQTT_SUBSCRIBE_TOPIC, {
      topic: this.config.topic,
      callback: (message) => {
        sendMessageToBus(EventBusMessageType.SERVICE_EVENT_ADD, {
          component: this.serviceName,
          data: JSON.parse(message),
        });
      },
    });
  }

  processQueue(message: any) {
    console.log(`${message}`);
  }

  defaultConfig() {
    return {
      isEnabled: false,
      topic: 'owntracks/#',
    };
  }
}
