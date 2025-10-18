import { User } from '../entity/User'
import { UserData } from '../types'
import bcrypt from 'bcrypt'
import { Repository } from 'typeorm'
import createHttpError from 'http-errors'
import { USER_ROLES } from '../constants'

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
}
