import { Tenant } from '../entity/Tenant'
import { Repository } from 'typeorm'
import { ITenant } from '../types'
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
}
