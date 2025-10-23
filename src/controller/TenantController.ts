import { Request, Response, NextFunction } from 'express'
import { Logger } from 'winston'
import { TenantServices } from '../service/TenantServices'
import { ITenant } from '../types'

export class TenantController {
    constructor(
        private logger: Logger,
        private tenantServices: TenantServices,
    ) {}

    async createTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, domain, address, phone } = req.body as ITenant

            const tenant = await this.tenantServices.create({
                name,
                domain,
                address,
                phone,
            })

            this.logger.info('Tenant created successfully', {
                tenantId: tenant.id,
            })

            res.status(201).json({
                message: 'Tenant created successfully',
                tenant,
            })
        } catch (error) {
            this.logger.error('Failed to create tenant', { error })
            next(error)
        }
    }
}
