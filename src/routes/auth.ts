import express from 'express'
import { AuthController } from '../controller/AuthController'
import { UserService } from '../service/UserService'
import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import registerValidators from '../validators/register-validators'
import loginValidators from '../validators/login-validators'
import { TokenService } from '../service/TokenService'
import { RefreshToken } from '../entity/RefreshToken'
import { CredentialService } from '../service/CredentialService'
import { authenticate } from '../middleware/authenticate'
const router = express.Router()

// we can also use inversify to inject the dependencies

// register dependencies
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)
const tokenService = new TokenService(refreshTokenRepository)
const credentialService = new CredentialService()
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentialService,
)

router.post(
    '/register',
    registerValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
)

router.post(
    '/login',
    loginValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
)

router.get(
    '/self',
    authenticate,
    (req: Request, res: Response, next: NextFunction) =>
        authController.self(req as AuthRequest, res, next),
)

export default router
