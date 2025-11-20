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
const info = (msg, data) => logger.info(data, msg);
const warn = (msg, data) => logger.warn(data, msg);
const error = (msg, data) => logger.error(data, msg);
const debug = (msg, data) => logger.debug(data, msg);
export { logger, info, warn, error, debug };
//# sourceMappingURL=logger.js.map