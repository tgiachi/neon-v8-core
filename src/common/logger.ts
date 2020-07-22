import winston = require('winston');

const createLogger = (application: string): winston.Logger => {
  return winston.createLogger({
    level: 'debug',
    format: winston.format.json(),
    defaultMeta: { service: application },
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.label({ label: application }),
          winston.format.colorize(),
          winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
          }),
          winston.format.printf(
            (info) =>
              `${info.timestamp} - ${info.level}:  [${info.label}]: ${info.message}`,
          ),
        ),
      }),
    ],
  });
};

export const logger = {
  createLogger,
};
