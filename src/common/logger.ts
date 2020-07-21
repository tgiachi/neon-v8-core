import winston = require('winston');

const createLogger = (application: string): winston.Logger => {
  return winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: application },
    transports: [
      new winston.transports.Console({ format: winston.format.simple() }),
    ],
  });
};

export const logger = {
  createLogger,
};
