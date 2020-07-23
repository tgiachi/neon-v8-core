import { Logger } from 'winston';
import {
  logger,
  INeonService,
  sendMessageToBus,
  EventBusMessageType,
  subscribeMessageToBus,
} from '../../common/';
import mqtt = require('mqtt');
import { NeonEngine } from '..';

export class MqttService implements INeonService {
         private hostname: string;
         private logger: Logger;
         private subscribedTopics: Map<string, any> = new Map();
         private mqttClient: mqtt.Client;
         name: string;
         version: string;
         description: string;

         constructor(hostname: string) {
           this.name = 'mqtt-service';
           this.description = 'MQTT Service';
           this.version = 'v1.0.0';
           this.hostname = hostname;
           this.logger = logger.createLogger(this.name);
         }

         async configure(_neonEngine: NeonEngine): Promise<boolean> {
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
             for (const subTopic of this.subscribedTopics.keys()) {
               const sanizedTopic = subTopic.replace('#', '');

               if (topic.startsWith(sanizedTopic)) {
                 this.subscribedTopics.get(subTopic)(message.toString());
               }
             }
             sendMessageToBus(EventBusMessageType.MQTT_MESSAGE_RECEIVED, {
               topic,
               message: message.toString(),
             });
           });

           subscribeMessageToBus(EventBusMessageType.MQTT_SUBSCRIBE_TOPIC, {
             callback: async (_type, payload) => {
               this.logger.info(`Subscribing to ${payload.topic}`);
               await this.mqttClient.subscribe(payload.topic);
               this.subscribedTopics.set(payload.topic, payload.callback);
             },
           });

           return true;
         }
       }
