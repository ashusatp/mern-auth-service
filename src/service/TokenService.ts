import { sign, JwtPayload } from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { Config } from '../config'
import { User } from '../entity/User'
import { Repository } from 'typeorm'
import { RefreshToken } from '../entity/RefreshToken'

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload) {
        let privateKey: string

        try {
            if (!Config.PRIVATE_KEY) {
                const err = createHttpError(500, 'SECRET_KEY is not configured')
                throw err
            }
            privateKey = Config.PRIVATE_KEY
        } catch (error) {
            const err = createHttpError(
                500,
                'Failed to read private key from file',
                {
                    cause:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                },
            )
            throw err
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service',
        })
        return accessToken
    }

    generateRefreshToken(payload: JwtPayload, refreshTokenId: string) {
        if (!Config.REFRESH_JWT_SECRET) {
            const err = createHttpError(
                500,
                'Refresh JWT secret not configured',
            )
            throw err
        }

        const refreshToken = sign(payload, Config.REFRESH_JWT_SECRET, {
            algorithm: 'HS256',
            expiresIn: '30d',
            issuer: 'auth-service',
            jwtid: refreshTokenId,
        })

        return refreshToken
    }

    async storeRefreshToken(user: User) {
        try {
            const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            const refreshToken = this.refreshTokenRepository.create({
                user,
                expiresAt,
            })

            const savedRefreshToken =
                await this.refreshTokenRepository.save(refreshToken)
            return savedRefreshToken
        } catch (error) {
            const httpError = createHttpError(
                500,
                'Failed to store refresh token',
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

    async deleteRefreshToken(refreshTokenId: number) {
        try {
            const token = await this.refreshTokenRepository.delete({
                id: refreshTokenId,
            })

            if (token.affected === 0) {
                const httpError = createHttpError(
                    404,
                    'Refresh token not found',
                )
                throw httpError
            }

            return token.affected === 1
        } catch (error) {
            const httpError = createHttpError(
                500,
                'Failed to delete refresh token',
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
}
