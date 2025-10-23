import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import logger from './config/logger'
import { HttpError } from 'http-errors'
import cors from 'cors'
import authRouter from './routes/auth'
import tenantRouter from './routes/tenant'
import cookieParser from 'cookie-parser'
import { Config } from './config'

const app = express()

app.use(express.static('public'))

const ALLOWED_DOMAINS = [Config.CLIENT_UI_DOMAIN, Config.ADMIN_UI_DOMAIN]

app.use(cors({ origin: ALLOWED_DOMAINS as string[], credentials: true }))

app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

app.get('/', async (req, res) => {
    // const err = createHttpError(401, "you are not allowed to access this page");
    // next(err);
    res.status(200).send('welcome to API service')
})

app.use('/auth', authRouter)
app.use('/tenant', tenantRouter)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.message)
    const statusCode = err.statusCode || err.status || 500
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
