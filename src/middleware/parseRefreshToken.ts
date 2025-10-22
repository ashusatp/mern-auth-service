import { expressjwt } from 'express-jwt'
import { Request } from 'express'
import { Config } from '../config'

if (!Config.REFRESH_JWT_SECRET) {
    throw new Error('Missing required configuration: REFRESH_JWT_SECRET')
}

export default expressjwt({
    secret: Config.REFRESH_JWT_SECRET,

    algorithms: ['HS256'],

    getToken(req: Request) {
        // Use optional chaining to avoid runtime errors if cookies is undefined
        const token = req.cookies?.refresh_token
        if (token) return token

        return null
    },
})
