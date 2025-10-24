import express from 'express'
import { User } from '../entity/User'
import { UserService } from '../service/UserService'
import { UserController } from '../controller/UserController'
import { AppDataSource } from '../config/data-source'
import logger from '../config/logger'
import { Request, Response, NextFunction } from 'express'
import { authenticate } from '../middleware/authenticate'
import { access } from '../middleware/access'
import { USER_ROLES } from '../constants'
import { UserUpdateRequest } from '../types'
import { TenantServices } from '../service/TenantServices'
import { Tenant } from '../entity/Tenant'

const router = express.Router()

const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantServices = new TenantServices(tenantRepository)
const userController = new UserController(userService, logger, tenantServices)

router.post(
    '/',
    authenticate,
    access([USER_ROLES.ADMIN]),
    (req: Request, res: Response, next: NextFunction) => {
        userController.createUser(req, res, next)
    },
)

router.get(
    '/',
    authenticate,
    access([USER_ROLES.ADMIN]),
    (req: Request, res: Response, next: NextFunction) => {
        userController.getUsers(req, res, next)
    },
)

router.get(
    '/:id',
    authenticate,
    access([USER_ROLES.ADMIN]),
    (req: Request, res: Response, next: NextFunction) => {
        userController.getUserById(req, res, next)
    },
)

router.put(
    '/:id',
    authenticate,
    access([USER_ROLES.ADMIN]),
    (req: UserUpdateRequest, res: Response, next: NextFunction) => {
        userController.updateUser(req, res, next)
    },
)

router.delete(
    '/:id',
    authenticate,
    access([USER_ROLES.ADMIN]),
    (req: Request, res: Response, next: NextFunction) => {
        userController.deleteUser(req, res, next)
    },
)

export default router
