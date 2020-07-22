import { Logger } from 'winston';
import {
  logger,
  INeonService,
  sendMessageToBus,
  EventBusMessageType,
} from '../../common/';
import mqtt = require('mqtt');

export class MqttService implements INeonService {
  private hostname: string;
  private logger: Logger;
  private mqttClient: mqtt.Client;
  name: string;
  version: string;

  constructor(hostname: string) {
    this.name = 'MQTT Service';
    this.version = 'v1.0.0';
    this.hostname = hostname;
    this.logger = logger.createLogger('mqtt-service');
  }
  async configure(): Promise<boolean> {
    return true;
  }

  public async start(): Promise<boolean> {
    this.logger.log('info', `connecting to MQTT ${this.hostname}`);
    this.mqttClient = mqtt.connect(this.hostname);
    this.mqttClient.on('connect', () => {
      this.logger.log('info', `connected to ${this.hostname}`);
      sendMessageToBus(EventBusMessageType.MQTT_CONNECTED, {
        hostname: this.hostname,
      });
    });
    this.mqttClient.on('message', (topic, message) => {
      sendMessageToBus(EventBusMessageType.MQTT_MESSAGE_RECEIVED, {
        topic,
        message: JSON.parse(message.toString()),
      });
    });

    return true;
  }
}
