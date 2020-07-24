import { INeonService, logger, defaultConfig } from '../../common';
import { Logger } from 'winston';
import { Application } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import loggerMiddleware from './middlewares/logger-middleware';
import IndexController from './controllers/index-controller';
import EventsController from './controllers/events-controller';
import { initNeonMiddleware } from './middlewares/neon-middleware';
import { NeonEngine } from '..';
import * as compression from 'compression';

export class ApiService implements INeonService {
  name: string;
  version: string;
  log: Logger;
  port = defaultConfig.apiDefaultPort;
  apiApp: Application;
  description: string;
  constructor() {
    this.name = 'api-service';
    this.description = 'ApiService';
    this.version = 'v1.0.0';
    this.log = logger.createLogger(this.name);
  }
  exportedContext() {
   return undefined;
  }

  async start(): Promise<boolean> {
    this.apiApp.listen(this.port, () => {
      this.log.info(`Api server listening on port: ${this.port}`);
    });
    return true;
  }
  private routes(controllers: {
    forEach: (arg0: (controller: any) => void) => void;
  }) {
    controllers.forEach((controller) => {
      this.apiApp.use('/', controller.router);
    });
  }

  private middlewares(middleWares: {
    forEach: (arg0: (middleWare: any) => void) => void;
  }) {
    middleWares.forEach((middleWare) => {
      this.apiApp.use(middleWare);
    });
  }

  async configure(_neonEngine: NeonEngine): Promise<boolean> {
    this.apiApp = express();
    this.apiApp.set('view engine', 'html');
    this.apiApp.use(compression({level: 9}));

    this.middlewares([
      loggerMiddleware,
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
      initNeonMiddleware(_neonEngine),
    ]);
    this.routes([new IndexController(), new EventsController()]);

    return true;
  }
}
