import { expressjwt } from 'express-jwt'
import { Request } from 'express'
import JwksClient from 'jwks-rsa'
import { Config } from '../config'

// Fail fast if JWKS URI isn't present
if (!Config.JWKS_URI) {
    throw new Error('Missing required configuration: JWKS_URI')
}

export const authenticate = expressjwt({
    secret: JwksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI, // safe now — we've already validated it above
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
    }),

    algorithms: ['RS256'],

    getToken(req: Request) {
        const authHeader = req.headers.authorization
        if (typeof authHeader === 'string') {
            const [scheme, token] = authHeader.split(' ')
            if (scheme.toLowerCase() === 'bearer' && token) return token
        }

        // Use optional chaining to avoid runtime errors if cookies is undefined
        const token = req.cookies?.access_token
        if (token) return token

        return null
    },
})
