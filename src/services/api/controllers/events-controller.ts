import * as express from 'express';
import { Response } from 'express';
import { IControllerBase } from '../../../common';
import { NeonEngine } from '../../neon-core';
import { DatabaseService } from '../../database';

class EventsController implements IControllerBase {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/events', this.index);
  }

  index = (_req: any, res: Response) => {
    const neonEngine = _req.neon as NeonEngine;

    const databaseService = neonEngine.resolveService(
      'database-service',
    ) as DatabaseService;

    res.json(databaseService.loadAll('events'));
  };
}

export default EventsController;
