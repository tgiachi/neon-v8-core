import {
  INeonService,
  logger,
  sendMessageToBus,
  EventBusMessageType,
  defaultConfig,
  INeonComponent,
} from '../common';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from 'winston';
import * as yaml from 'js-yaml';

export class NeonEngine {
  services: Map<string, INeonService> = new Map();
  components: INeonComponent[] = [];
  log: Logger;
  public context: {};

  constructor(appInit: {
    services: INeonService[];
    components: INeonComponent[];
  }) {
    this.log = logger.createLogger('neon-engine');
    for (const service of appInit.services) {
      this.services.set(service.name, service);
    }
    this.components = appInit.components || [];
    this.configure();
  }

  configure() {
    this.log.info(`NEON root:${defaultConfig.rootDirectory} `);
    if (defaultConfig.rootDirectory[0] === '~') {
      defaultConfig.rootDirectory = path.join(
        process.env.HOME,
        defaultConfig.rootDirectory.slice(1),
      );
    }
    this.createDirectoryIfNotExists(defaultConfig.rootDirectory);

    defaultConfig.defaultDatabasePath = path.join(
      defaultConfig.rootDirectory,
      defaultConfig.defaultDatabasePath,
    );
    this.createDirectoryIfNotExists(defaultConfig.defaultDatabasePath);

    this.log.info(
      `Database directory path: ${defaultConfig.defaultDatabasePath}`,
    );

    defaultConfig.configDirectory = path.join(
      defaultConfig.rootDirectory,
      defaultConfig.configDirectory,
    );

    this.createDirectoryIfNotExists(defaultConfig.configDirectory);
    this.log.info(`Config directory path: ${defaultConfig.configDirectory}`);

    defaultConfig.scriptsDirectory = path.join(
      defaultConfig.rootDirectory,
      defaultConfig.scriptsDirectory,
    );

    this.createDirectoryIfNotExists(defaultConfig.scriptsDirectory);
    this.log.info(`Scripts directory path: ${defaultConfig.scriptsDirectory}`);
  }

  private createDirectoryIfNotExists(path: string) {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
  }

  public resolveService(serviceName: string) {
    if (this.services.has(serviceName)) {
      return this.services.get(serviceName);
    }
    return null;
  }
  public getService<T = INeonService>(c: new () => T): T {
    console.log(typeof c);
    for (const service of this.services.keys()) {
      if (typeof c === typeof this.services[service]) {
        return this.services[service];
      }
    }
    return null;
  }

  private loadConfig(component: INeonComponent): boolean {
    const componentDirectory = path.join(
      defaultConfig.configDirectory,
      component.serviceName,
    );

    const componentConfigFile = path.join(componentDirectory, 'config.yml');

    if (!fs.existsSync(componentDirectory)) {
      this.log.info(
        `Creating component config directory ${component.serviceName}`,
      );
      fs.mkdirSync(componentDirectory);
    }
    if (!fs.existsSync(componentConfigFile)) {
      this.log.info(
        `Saving default config for component ${component.serviceName}`,
      );
      const defaultConfig = component.defaultConfig();
      if (defaultConfig !== undefined) {
        const yamlStr = yaml.safeDump(defaultConfig);
        fs.writeFileSync(componentConfigFile, yamlStr, 'utf8');
      }
    }

    if (fs.existsSync(componentConfigFile)) {
      const yamlStr = fs.readFileSync(componentConfigFile);

      const data = yaml.load(yamlStr.toString());
      if (data.isEnabled !== undefined && data.isEnabled !== false) {
        this.log.info(
          `Loading config for component ${component.serviceName}: ${data.isEnabled}`,
        );
        component.loadConfig(data);
        return true;
      }
    }
    return false;
  }

  private async startService(service: INeonService): Promise<boolean> {
    this.log.info(`configuring service: ${service.name} ${service.version}`);
    await service.configure(this);
    const serviceContext = service.exportedContext();
    if (serviceContext !== undefined) {
      const globalContext = this.context;
      this.context = { ...globalContext, ...serviceContext };
    }
    this.log.info(`starting service: ${service.name} ${service.version}`);
    return await service.start();
  }

  private startComponent(component: INeonComponent): void {
    this.log.info(`starting component: ${component.name} ${component.version}`);
    if (this.loadConfig(component)) {
      component.start(this);
    }
  }

  public async start(): Promise<boolean> {
    Promise.resolve()
      .then(async () => {
        for (const service of this.services.values()) {
          await this.startService(service);
        }
      })
      .then(async () => {
        for (const component of this.components) {
          await this.startComponent(component);
        }
      })
      .then(() => {
        sendMessageToBus(EventBusMessageType.APPLICATION_READY, {
          isReady: true,
        });
      })
      .then(() => {
        const used = process.memoryUsage();
        for (const key in used) {
          this.log.info(
            `${key} ${Math.round((used[key] / 1024 / 1024) * 100) / 100} MB`,
          );
        }
      });

    return true;
  }
}
