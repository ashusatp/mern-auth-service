import { RegisterUserRequest, LoginUserRequest } from '../types'
import { Response, NextFunction } from 'express'
import { UserService } from '../service/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { JwtPayload } from 'jsonwebtoken'
import { TokenService } from '../service/TokenService'
import { CredentialService } from '../service/CredentialService'
export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
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

            // find user
            const existingUser = await this.userService.findByEmail(email)
            if (existingUser) {
                this.logger.error('User already exists', { email })
                res.status(400).json({ message: 'User already exists' })
                return
            }

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

            // generate payload
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            // generate access token
            const accessToken = this.tokenService.generateAccessToken(payload)

            // store refresh token
            const storedRefreshToken =
                await this.tokenService.storeRefreshToken(user)

            // generate refresh token
            const refreshToken = this.tokenService.generateRefreshToken(
                payload,
                String(storedRefreshToken.id),
            )

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

    async login(req: LoginUserRequest, res: Response, next: NextFunction) {
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

            const { email, password } = req.body

            // find user
            const existingUser = await this.userService.findByEmail(email)
            if (!existingUser) {
                this.logger.error('User not found', { email })
                res.status(400).json({
                    message: 'Email or password is incorrect',
                })
                return
            }

            // compare password
            const isPasswordValid =
                await this.credentialService.comparePassword(
                    password,
                    existingUser.password as string,
                )

            if (!isPasswordValid) {
                this.logger.error('Invalid password', { email })
                res.status(400).json({
                    message: 'Email or password is incorrect',
                })
                return
            }

            // log
            this.logger.info('User logged in successfully', {
                userId: existingUser.id,
                email: existingUser.email,
            })

            // generate payload
            const payload: JwtPayload = {
                sub: String(existingUser.id),
                role: existingUser.role,
            }

            // generate access token
            const accessToken = this.tokenService.generateAccessToken(payload)

            // store refresh token
            const storedRefreshToken =
                await this.tokenService.storeRefreshToken(existingUser)

            // generate refresh token
            const refreshToken = this.tokenService.generateRefreshToken(
                payload,
                String(storedRefreshToken.id),
            )

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
                message: 'User logged in successfully',
                userId: existingUser.id,
            })
        } catch (error) {
            this.logger.error('Failed to login user', { error })
            next(error)
        }
    }
}
