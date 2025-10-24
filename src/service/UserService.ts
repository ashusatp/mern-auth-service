import { User } from '../entity/User'
import { UserData } from '../types'
import bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import createHttpError from 'http-errors'
import { IUserFilters } from '../types'
import { USER_ROLES } from '../constants'
import { Tenant } from '../entity/Tenant'
import { FindOptionsWhere } from 'typeorm'

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: UserData) {
        const hashedPassword = await bcrypt.hash(password, 10)

        try {
            const user = this.userRepository.create({
                name: `${firstName} ${lastName}`,
                email,
                password: hashedPassword,
                role: USER_ROLES.CUSTOMER,
            })

            return await this.userRepository.save(user)
        } catch (error) {
            const httpError = createHttpError(500, 'Failed to create user', {
                cause: error instanceof Error ? error.message : 'Unknown error',
            })
            throw httpError
        }
    }

    async findByEmail(email: string) {
        try {
            return await this.userRepository.findOne({
                where: { email },
            })
        } catch (error) {
            const httpError = createHttpError(
                500,
                'Failed to find user by email',
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

    async findById(id: number) {
        try {
            return await this.userRepository.findOne({
                where: { id },
            })
        } catch (error) {
            const httpError = createHttpError(
                500,
                'Failed to find user by id',
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

    async createManagerUser({
        firstName,
        lastName,
        email,
        password,
        role,
        tenant,
    }: UserData & { role: string; tenant: Tenant }) {
        const hashedPassword = await bcrypt.hash(password, 10)

        try {
            const user = this.userRepository.create({
                name: `${firstName} ${lastName}`,
                email,
                password: hashedPassword,
                role,
                tenant,
            })

            return await this.userRepository.save(user)
        } catch (error) {
            const httpError = createHttpError(
                500,
                'Failed to create user with role',
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

    async getUsers(filters: IUserFilters = {}) {
        try {
            // Set default pagination values
            const page = filters.page || 1
            const limit = filters.limit || 10

            // Build where clause for filtering
            const where: FindOptionsWhere<User> = {}
            if (filters.role) {
                where.role = filters.role
            }
            if (filters.email) {
                where.email = filters.email
            }
            if (filters.name) {
                where.name = filters.name
            }

            // Calculate skip value for pagination
            const skip = (page - 1) * limit

            // Fetch users with pagination
            const [users, total] = await this.userRepository.findAndCount({
                where,
                skip,
                take: limit,
            })

            // Return empty array if no users found
            if (total === 0) {
                return {
                    data: [],
                    total: 0,
                    page,
                    limit,
                    totalPages: 0,
                }
            }

            const abstractedUsers = await this.abstractUserData(users)

            return {
                data: abstractedUsers,
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        } catch (error) {
            const httpError = createHttpError(500, 'Failed to get users', {
                cause: error instanceof Error ? error.message : 'Unknown error',
            })
            throw httpError
        }
    }

    async abstractUserData(users: User[]) {
        return users.map((user) => {
            return {
                id: user?.id,
                name: user?.name,
                email: user?.email,
                role: user?.role,
            }
        })
    }

    async updateUser(
        id: number,
        updateData: {
            firstName?: string
            lastName?: string
            email?: string
            password?: string
            role?: string
        },
    ) {
        try {
            const user = await this.findById(id)

            if (!user) {
                const httpError = createHttpError(404, 'User not found')
                throw httpError
            }

            // Update name if firstName or lastName is provided
            if (updateData.firstName || updateData.lastName) {
                const currentName = user.name || ''
                const firstName =
                    updateData.firstName || currentName.split(' ')[0] || ''
                const lastName =
                    updateData.lastName ||
                    currentName.split(' ').slice(1).join(' ') ||
                    ''
                user.name = `${firstName} ${lastName}`.trim()
            }

            // Update email if provided
            if (updateData.email) {
                // Check if email is already taken by another user
                const existingUser = await this.findByEmail(updateData.email)
                if (existingUser && existingUser.id !== id) {
                    const httpError = createHttpError(
                        400,
                        'Email already exists',
                    )
                    throw httpError
                }
                user.email = updateData.email
            }

            // Update password if provided
            if (updateData.password) {
                user.password = await bcrypt.hash(updateData.password, 10)
            }

            // Update role if provided
            if (updateData.role) {
                user.role = updateData.role
            }

            return await this.userRepository.save(user)
        } catch (error) {
            if (error instanceof Error && 'statusCode' in error) {
                throw error
            }
            const httpError = createHttpError(500, 'Failed to update user', {
                cause: error instanceof Error ? error.message : 'Unknown error',
            })
            throw httpError
        }
    }

    async deleteUser(id: number) {
        try {
            const user = await this.findById(id)

            if (!user) {
                const httpError = createHttpError(404, 'User not found')
                throw httpError
            }

            await this.userRepository.remove(user)
            return user
        } catch (error) {
            if (error instanceof Error && 'statusCode' in error) {
                throw error
            }
            const httpError = createHttpError(500, 'Failed to delete user', {
                cause: error instanceof Error ? error.message : 'Unknown error',
            })
            throw httpError
        }
    }
}
