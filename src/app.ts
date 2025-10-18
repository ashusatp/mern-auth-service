import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import logger from './config/logger'
import { HttpError } from 'http-errors'
import cors from 'cors'

const app = express()

app.get('/', async (req, res) => {
    // const err = createHttpError(401, "you are not allowed to access this page");
    // next(err);
    res.status(200).send('welcome to API service')
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    })
})

export default app
