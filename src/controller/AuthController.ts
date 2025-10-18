import { RegisterUserRequest } from '../types'
import { Response, NextFunction } from 'express'
import { UserService } from '../service/UserService'
import { Logger } from 'winston'

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
        const { firstName, lastName, email, password } = req.body

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            })

            this.logger.info('User registered successfully', {
                userId: user.id,
                email: user.email,
            })

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
