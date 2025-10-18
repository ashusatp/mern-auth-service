import winston from 'winston'
import { Config } from '.'

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: {
        serviceName: 'auth-service',
    },
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.colorize(),
                winston.format.printf(
                    ({ level, message, timestamp, serviceName, ...meta }) => {
                        const metaString =
                            Object.keys(meta).length > 0
                                ? ` | ${JSON.stringify(meta)}`
                                : ''
                        return `[${timestamp}] [${serviceName}] ${level}: ${message}${metaString}`
                    },
                ),
            ),
        }),

        new winston.transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
            silent: Config.NODE_ENV === 'test',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.printf(
                    ({ level, message, timestamp, serviceName, ...meta }) => {
                        const metaString =
                            Object.keys(meta).length > 0
                                ? ` | ${JSON.stringify(meta)}`
                                : ''
                        return `[${timestamp}] [${serviceName}] ${level}: ${message}${metaString}`
                    },
                ),
            ),
        }),

        new winston.transports.File({
            dirname: 'logs',
            filename: 'app.log',
            level: 'info',
            silent: Config.NODE_ENV === 'test',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.printf(
                    ({ level, message, timestamp, serviceName, ...meta }) => {
                        const metaString =
                            Object.keys(meta).length > 0
                                ? ` | ${JSON.stringify(meta)}`
                                : ''
                        return `[${timestamp}] [${serviceName}] ${level}: ${message}${metaString}`
                    },
                ),
            ),
        }),

        new winston.transports.File({
            dirname: 'logs',
            filename: 'api.log',
            level: 'info',
            silent: Config.NODE_ENV === 'test',
            format: winston.format.combine(
                winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss',
                }),
                winston.format.printf(
                    ({ level, message, timestamp, serviceName, ...meta }) => {
                        const metaString =
                            Object.keys(meta).length > 0
                                ? ` | ${JSON.stringify(meta)}`
                                : ''
                        return `[${timestamp}] [${serviceName}] ${level}: ${message}${metaString}`
                    },
                ),
            ),
        }),
    ],
})

export default logger
