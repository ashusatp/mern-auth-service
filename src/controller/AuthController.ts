import fs from 'fs'
import path from 'path'
import { RegisterUserRequest } from '../types'
import { Response, NextFunction } from 'express'
import { UserService } from '../service/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { JwtPayload, sign } from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { Config } from '../config'

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            // validation
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                this.logger.error('Validation errors', {
                    errors: errors.array(),
                })
                res.status(400).json({ errors: errors.array() })
                return
            }

            const { firstName, lastName, email, password } = req.body

            // create user
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            })

            // log
            this.logger.info('User registered successfully', {
                userId: user.id,
                email: user.email,
            })

            let privateKey: Buffer
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, '../../certs/private.pem'),
                )
            } catch (error) {
                const err = createHttpError(
                    500,
                    'Failed to read private key from file',
                    {
                        cause:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error',
                    },
                )
                next(err)
                return
            }

            const patload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            const accessToken = sign(patload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                issuer: 'auth-service',
            })

            if (!Config.REFRESH_JWT_SECRET) {
                const err = createHttpError(
                    500,
                    'Refresh JWT secret not configured',
                )
                next(err)
                return
            }

            const refreshToken = sign(patload, Config.REFRESH_JWT_SECRET, {
                algorithm: 'HS256',
                expiresIn: '30d',
                issuer: 'auth-service',
            })

            // set cookies
            res.cookie('access_token', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, // 1 hour
                httpOnly: true, // very important
            })
            res.cookie('refresh_token', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
                httpOnly: true, // very important
            })

            // response
            res.status(201).json({
                message: 'User registered successfully',
                userId: user.id,
            })
        } catch (error) {
            this.logger.error('Failed to register user', { error })
            next(error)
        }
    }
}
