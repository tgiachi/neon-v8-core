import * as express from 'express';
import { Request, Response } from 'express';
import { IControllerBase } from '../../../common';

class IndexController implements IControllerBase {
  public path = '/';
  public router = express.Router();

  constructor() {
    this.initRoutes();
  }

  public initRoutes() {
    this.router.get('/', this.index);
  }

  index = (_req: Request, res: Response) => {
    const users = [
      {
        id: 1,
        name: 'Ali',
      },
      {
        id: 2,
        name: 'Can',
      },
      {
        id: 3,
        name: 'Ahmet',
      },
    ];

    res.json(users);
  };
}

export default IndexController;
