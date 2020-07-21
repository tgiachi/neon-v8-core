import { MqttService, DatabaseService } from "./components/"

const databaseService = new DatabaseService();
const mqttService = new MqttService("http://test.mosquitto.org");

databaseService.start();
mqttService.connect();
