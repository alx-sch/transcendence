import pino from 'pino';

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:HH:MM:ss',
      ignore: 'pid,hostname', // Removes the noise (process ID, etc)
    },
  },
});

const info = (msg: string, data?: object) => logger.info(data, msg);
const warn = (msg: string, data?: object) => logger.warn(data, msg);
const error = (msg: string, data?: object) => logger.error(data, msg);
const debug = (msg: string, data?: object) => logger.debug(data, msg);

export { logger, info, warn, error, debug };
