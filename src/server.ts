// import createHttpError from "http-errors";
import app from './app'
import { Config } from './config'
import { AppDataSource } from './config/data-source'
import logger from './config/logger'

const startServer = async () => {
    const PORT = Config.PORT || 5501
    const NODE_ENV = Config.NODE_ENV || 'development'

    try {
        logger.info('Starting auth service', {
            port: PORT,
            environment: NODE_ENV,
            timestamp: new Date().toISOString(),
        })

        await AppDataSource.initialize()
        logger.info('Database connected successfully', {
            database: Config.DB_NAME,
            host: Config.DB_HOST,
            port: Config.DB_PORT,
        })

        app.listen(PORT, () => {
            logger.info('Server started successfully', {
                port: PORT,
                environment: NODE_ENV,
                baseUrl: `http://localhost:${PORT}`,
                apiUrl: `http://localhost:${PORT}/api`,
            })
        })
    } catch (err) {
        if (err instanceof Error) {
            logger.error('Server startup failed', {
                error: err.message,
                stack: err.stack,
            })
            setTimeout(() => {
                process.exit(1)
            }, 1000)
        }
    }
}

startServer()
