import express from 'express'
import { Request, Response, NextFunction } from 'express'
import { TenantController } from '../controller/TenantController'
import { TenantServices } from '../service/TenantServices'
import { AppDataSource } from '../config/data-source'
import { Tenant } from '../entity/Tenant'
import logger from '../config/logger'

const router = express.Router()

const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantServices = new TenantServices(tenantRepository)
const tenantController = new TenantController(logger, tenantServices)

router.post('/', (req: Request, res: Response, next: NextFunction) => {
    tenantController.createTenant(req, res, next)
})

export default router
