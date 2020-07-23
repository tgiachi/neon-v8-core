import * as dotenv from 'dotenv';

export interface NeonConfig {
  rootDirectory: string;
  configDirectory: string;
  scriptsDirectory: string;
  defaultDatabasePath: string;
  mqttServer: string;
  apiDefaultPort: number;
}

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case 'test':
    path = `${__dirname}/../../.env.test`;
    break;
  case 'production':
    path = `${__dirname}/../../.env.production`;
    break;
  default:
    path = `${__dirname}/../../.env.dev`;
}
dotenv.config({ path: path });

export const defaultConfig: NeonConfig = {
  rootDirectory: process.env.NEON_ROOT_DIRECTORY || '~/neon',
  configDirectory: process.env.NEON_CONFIG_DIRECTORY || 'config',
  scriptsDirectory: process.env.NEON_SCRIPTS_DIRECTORY || 'scripts',
  defaultDatabasePath: process.env.DEFAULT_DATABASE_PATH || 'db',
  apiDefaultPort: Number(process.env.API_SERVER_PORT) || 3000,
  mqttServer: process.env.MQTT_SERVER || 'http://test.mosquitto.org',
};
