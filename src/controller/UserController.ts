import { UserService } from '../service/UserService'
import { TenantServices } from '../service/TenantServices'
import { Request, Response, NextFunction } from 'express'
import { Logger } from 'winston'
import { IUserFilters, UserUpdateRequest } from '../types'
import { USER_ROLES } from '../constants'
import createHttpError from 'http-errors'

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tenantServices: TenantServices,
    ) {}

    async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { firstName, lastName, email, password, tenantId } = req.body

            const tenant = await this.tenantServices.findById(tenantId)
            if (!tenant) {
                const httpError = createHttpError(404, 'Tenant not found', {
                    cause: 'Tenant not found',
                })
                next(httpError)
                return
            }

            const user = await this.userService.createManagerUser({
                firstName,
                lastName,
                email,
                password,
                role: USER_ROLES.MANAGER,
                tenant,
            })

            this.logger.info('User created successfully', {
                userId: user.id,
                email: user.email,
                role: user.role,
            })

            res.status(201).json({
                message: 'User created successfully',
                userId: { ...user, password: undefined },
            })
        } catch (error) {
            this.logger.error('Failed to create user', { error })
            next(error)
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const queryFilters = req.query

            const filters: IUserFilters = {}

            filters.role = USER_ROLES.MANAGER

            if (queryFilters.role) {
                filters.role = queryFilters.role as string
            }
            if (queryFilters.name) {
                filters.name = queryFilters.name as string
            }
            if (queryFilters.email) {
                filters.email = queryFilters.email as string
            }
            if (queryFilters.page) {
                filters.page = Number(queryFilters.page)
            }
            if (queryFilters.limit) {
                filters.limit = Number(queryFilters.limit)
            }

            const paginatedUsers = await this.userService.getUsers(filters)

            this.logger.info('Users fetched successfully', {
                total: paginatedUsers.total,
                page: paginatedUsers.page,
                limit: paginatedUsers.limit,
            })

            res.status(200).json(paginatedUsers)
        } catch (error) {
            this.logger.error('Failed to get users', { error })
            next(error)
        }
    }

    async getUserById(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params
            const user = await this.userService.findById(Number(id))

            if (!user) {
                this.logger.error('User not found', { id })
                const httpError = createHttpError(404, 'User not found', {
                    cause: 'User not found',
                })
                next(httpError)
                return
            }

            res.status(200).json({
                message: 'User fetched successfully',
                user: { ...user, password: undefined },
            })
        } catch (error) {
            this.logger.error('Failed to get user by id', { error })
            next(error)
        }
    }

    async updateUser(
        req: UserUpdateRequest,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const { id } = req.params
            const { firstName, lastName, email, password, role } = req.body

            const updatedUser = await this.userService.updateUser(Number(id), {
                firstName,
                lastName,
                email,
                password,
                role,
            })

            this.logger.info('User updated successfully', {
                userId: updatedUser.id,
                email: updatedUser.email,
            })

            res.status(200).json({
                message: 'User updated successfully',
                user: { ...updatedUser, password: undefined },
            })
        } catch (error) {
            this.logger.error('Failed to update user', { error })
            next(error)
        }
    }

    async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params

            const deletedUser = await this.userService.deleteUser(Number(id))

            this.logger.info('User deleted successfully', {
                userId: deletedUser.id,
                email: deletedUser.email,
            })

            res.status(200).json({
                message: 'User deleted successfully',
                user: { ...deletedUser, password: undefined },
            })
        } catch (error) {
            this.logger.error('Failed to delete user', { error })
            next(error)
        }
    }
}
