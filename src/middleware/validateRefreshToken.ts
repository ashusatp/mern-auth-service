import { expressjwt } from 'express-jwt'
import { Request } from 'express'
import { Config } from '../config'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import logger from '../config/logger'
import { Jwt, JwtPayload } from 'jsonwebtoken'

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

    async isRevoked(req: Request, token?: Jwt) {
        if (!token) return true
        logger.info('Checking if refresh token is revoked', {
            token: (token.payload as JwtPayload)?.jti,
        })
        try {
            const refreshTokenRepository =
                AppDataSource.getRepository(RefreshToken)
            const refreshToken = await refreshTokenRepository.findOne({
                where: {
                    id: Number((token.payload as JwtPayload)?.jti),
                    user: {
                        id: Number(token.payload?.sub),
                    },
                },
            })

            return refreshToken === null
        } catch (error) {
            logger.error('Failed to check if refresh token is revoked', {
                error,
                token: (token.payload as JwtPayload)?.jti,
            })
        }
        return true
    },
})
