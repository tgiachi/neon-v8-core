import { MqttService, DatabaseService } from "./components/"
import { sendMessageToBus, EventBusMessageType } from "./common/eventbus";
import { INeonService, logger } from './common';
const databaseService = new DatabaseService();
const mqttService = new MqttService("http://test.mosquitto.org");

const services: INeonService[] = [];
const log = logger.createLogger('neon-service');

services.push(databaseService);
services.push(mqttService);


const startServices = async (services: INeonService[]) : Promise<boolean> => {
  for(const service of services) {
    log.log('info', `configuring service: ${service.name} ${service.version}`);
    await service.configure();
    log.log('info', `starting service: ${service.name} ${service.version}`);
    await service.start();
  }
  return true;
}

Promise.resolve().then(async () => {
  await startServices(services);
}).then(() =>{
  sendMessageToBus(EventBusMessageType.APPLICATION_READY, {isReady: true});
})


