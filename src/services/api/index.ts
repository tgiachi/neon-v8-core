import { INeonService, logger, defaultConfig } from '../../common';
import { Logger } from 'winston';
import { Application } from 'express';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import 'reflect-metadata';
import loggerMiddleware from './middlewares/logger-middleware';
import IndexController from './controllers/index-controller';

export class ApiService implements INeonService {
  name: string;
  version: string;
  log: Logger;
  port = defaultConfig.apiDefaultPort;
  apiApp: Application;

  constructor() {
    this.name = 'ApiService';
    this.version = 'v1.0.0';
    this.log = logger.createLogger('api-service');
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

  async configure(): Promise<boolean> {
    this.apiApp = express();
    this.apiApp.set('view engine', 'html');

    this.middlewares([
      loggerMiddleware,
      bodyParser.json(),
      bodyParser.urlencoded({ extended: true }),
    ]);
    this.routes([
      new IndexController()
    ])

    return true;
  }
}
