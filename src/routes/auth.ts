import express from 'express'
import { AuthController } from '../controller/AuthController'
import { UserService } from '../service/UserService'
import { Request, Response } from 'express'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'

const router = express.Router()

// we can also use inversify to inject the dependencies
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const authController = new AuthController(userService)

router.post('/register', (req: Request, res: Response) =>
    authController.register(req, res),
)

export default router
