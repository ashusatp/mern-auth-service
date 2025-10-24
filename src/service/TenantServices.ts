import { Tenant } from '../entity/Tenant'
import { Repository } from 'typeorm'
import { ITenant, ITenantUpdate } from '../types'
import createHttpError from 'http-errors'

export class TenantServices {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenant: ITenant) {
        try {
            const newTenant = this.tenantRepository.create(tenant)
            return await this.tenantRepository.save(newTenant)
        } catch (error) {
            const httpError = createHttpError(500, 'Failed to create tenant', {
                cause: error instanceof Error ? error.message : 'Unknown error',
            })
            throw httpError
        }
    }

    async findAll() {
        try {
            return await this.tenantRepository.find()
        } catch (error) {
            const httpError = createHttpError(500, 'Failed to get tenants', {
                cause: error instanceof Error ? error.message : 'Unknown error',
            })
            throw httpError
        }
    }

    async findById(id: string) {
        try {
            const tenant = await this.tenantRepository.findOne({
                where: { id: Number(id) },
            })
            if (!tenant) {
                const httpError = createHttpError(404, 'Tenant not found', {
                    cause: 'Tenant not found',
                })
                throw httpError
            }
            return tenant
        } catch (error) {
            const httpError = createHttpError(
                500,
                'Failed to get tenant by id',
                {
                    cause:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                },
            )
            throw httpError
        }
    }

    async update(id: string, tenant: ITenantUpdate) {
        try {
            await this.tenantRepository.update(Number(id), tenant)
            return { message: 'Tenant updated successfully' }
        } catch (error) {
            const httpError = createHttpError(500, 'Failed to update tenant', {
                cause: error instanceof Error ? error.message : 'Unknown error',
            })
            throw httpError
        }
    }

    async delete(id: string) {
        try {
            const result = await this.tenantRepository.delete(Number(id))
            if (result.affected === 0) {
                const httpError = createHttpError(404, 'Tenant not found', {
                    cause: 'Tenant not found',
                })
                throw httpError
            }
        } catch (error) {
            const httpError = createHttpError(500, 'Failed to delete tenant', {
                cause: error instanceof Error ? error.message : 'Unknown error',
            })
            throw httpError
        }
    }
}
