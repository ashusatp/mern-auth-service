import { RegisterUserRequest } from '../types'
import { Response, NextFunction } from 'express'
import { UserService } from '../service/UserService'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'

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
