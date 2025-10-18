import express from 'express'
import { AuthController } from '../controller/AuthController'
import { UserService } from '../service/UserService'
import { Request, Response, NextFunction } from 'express'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'

const router = express.Router()

// we can also use inversify to inject the dependencies

// register dependencies
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const authController = new AuthController(userService, logger)

router.post('/register', (req: Request, res: Response, next: NextFunction) =>
    authController.register(req, res, next),
)

export default router
