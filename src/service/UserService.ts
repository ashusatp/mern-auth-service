import { User } from '../entity/User'
import { UserData } from '../types'
import bcrypt from 'bcrypt'
import { Repository } from 'typeorm'

export class UserService {
    constructor(private userRepository: Repository<User>) {}

    async create({ firstName, lastName, email, password }: UserData) {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = this.userRepository.create({
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword,
        })

        await this.userRepository.save(user)

        return user
    }
}
