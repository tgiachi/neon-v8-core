import { Request, Response } from 'express';
import { logger } from "../../../common"

const loggerMiddleware = (req: Request, _resp: Response, next): void => {
  const log = logger.createLogger('api-service');
  log.debug(`Request logged: METHOD: ${req.method} PATH: ${req.path}`);
  next();
};

export default loggerMiddleware;
