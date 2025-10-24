import { Request, Response, NextFunction } from 'express'
import { Logger } from 'winston'
import { TenantServices } from '../service/TenantServices'
import { ITenant, ITenantUpdate, TenantUpdateRequest } from '../types'
import createHttpError from 'http-errors'
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

    async getTenants(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantServices.findAll()
            res.status(200).json({
                message: 'Tenants fetched successfully',
                tenants,
            })
        } catch (error) {
            this.logger.error('Failed to get tenants', { error })
            next(error)
        }
    }

    async getTenantById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as { id: string }
            const tenant = await this.tenantServices.findById(id)

            if (tenant === null || tenant === undefined) {
                const httpError = createHttpError(404, 'Tenant not found', {
                    cause: 'Tenant not found',
                })
                throw httpError
            }

            this.logger.info('Tenant fetched successfully', {
                tenantId: tenant.id,
            })

            res.status(200).json({
                message: 'Tenant fetched successfully',
                tenant,
            })
        } catch (error) {
            this.logger.error('Failed to get tenant by id', { error })
            next(error)
        }
    }

    async updateTenant(
        req: TenantUpdateRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params as { id: string }
            const { name, domain, address, phone } = req.body as {
                name?: string
                domain?: string
                address?: string
                phone?: string
            }

            if (!name && !domain && !address && !phone) {
                const httpError = createHttpError(400, 'No fields to update', {
                    cause: 'No fields to update',
                })
                throw httpError
            }

            const updateData: ITenantUpdate = {}
            if (name) {
                updateData.name = name
            }
            if (domain) {
                updateData.domain = domain
            }
            if (address) {
                updateData.address = address
            }
            if (phone) {
                updateData.phone = phone
            }

            const tenant = await this.tenantServices.update(id, updateData)

            if (!tenant) {
                const httpError = createHttpError(404, 'Tenant not found', {
                    cause: 'Tenant not found',
                })
                throw httpError
            }

            this.logger.info('Tenant updated successfully', {
                tenantId: id,
            })

            res.status(200).json({
                message: 'Tenant updated successfully',
                tenant,
            })
        } catch (error) {
            this.logger.error('Failed to update tenant', { error })
            next(error)
        }
    }

    async deleteTenant(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params as { id: string }
            const tenant = await this.tenantServices.delete(id)

            if (!tenant) {
                const httpError = createHttpError(404, 'Tenant not found', {
                    cause: 'Tenant not found',
                })
                throw httpError
            }

            this.logger.info('Tenant deleted successfully', {
                tenantId: id,
            })
            res.status(200).json({ message: 'Tenant deleted successfully' })
        } catch (error) {
            this.logger.error('Failed to delete tenant', { error })
            next(error)
        }
    }
}
