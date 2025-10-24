import express from 'express'
import { Request, Response, NextFunction } from 'express'
import { TenantController } from '../controller/TenantController'
import { TenantServices } from '../service/TenantServices'
import { AppDataSource } from '../config/data-source'
import { Tenant } from '../entity/Tenant'
import logger from '../config/logger'
import { authenticate } from '../middleware/authenticate'
import { access } from '../middleware/access'
import { USER_ROLES } from '../constants'

const router = express.Router()

const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantServices = new TenantServices(tenantRepository)
const tenantController = new TenantController(logger, tenantServices)

router.post(
    '/',
    authenticate,
    access([USER_ROLES.ADMIN]),
    (req: Request, res: Response, next: NextFunction) => {
        tenantController.createTenant(req, res, next)
    },
)

export default router
