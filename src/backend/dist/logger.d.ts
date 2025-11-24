import pino from 'pino';
declare const logger: pino.Logger<never, boolean>;
declare const info: (msg: string, data?: object) => void;
declare const warn: (msg: string, data?: object) => void;
declare const error: (msg: string, data?: object) => void;
declare const debug: (msg: string, data?: object) => void;
export { logger, info, warn, error, debug };
//# sourceMappingURL=logger.d.ts.map