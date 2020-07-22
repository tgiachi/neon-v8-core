import { EventBus } from 'ts-bus';
import { logger } from '../common/logger';
export interface IEventBusMessageReceiver {
  callback(messageType: EventBusMessageType, payload: any): void;
}

const log = logger.createLogger('eventbus');
export const bus = new EventBus();

export const sendMessageToBus = (
  messageType: EventBusMessageType,
  message: any,
): void => {
  log.log('debug', `sending message type ${messageType} => ${JSON.stringify(message)} `);
  bus.publish({ type: messageType, payload: message });
};

export const subscribeMessageToBus = (
  messageType: EventBusMessageType,
  callback: IEventBusMessageReceiver,
): void => {
  bus.subscribe(messageType.toString(), (event) => {
    log.log(
      'debug',
      `received message type ${messageType} => ${JSON.stringify(event.payload)} `,
    );

    callback.callback(messageType, event.payload);
  });
};

export enum EventBusMessageType {
  APPLICATION_READY = 'APPLICATION_READY',
  MQTT_CONNECTED = 'MQTT_CONNECTED',
  MQTT_MESSAGE_RECEIVED = 'MQTT_MESSAGE_RECEIVED',
  SERVICE_SCHEDULER_ADD_JOB = 'SERVICE_SCHEDULER_ADD_JOB',
  SERVICE_SCHEDULER_CANCEL_JOB = 'SERVICE_SCHEDULER_CANCEL_JOB',
}
