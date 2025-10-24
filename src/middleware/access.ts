import { Response, NextFunction, Request } from 'express'
import { AuthRequest } from '../types'
import createHttpError from 'http-errors'

export const access = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest
        const role = _req.auth.role
        if (!roles.includes(role)) {
            const error = createHttpError(403, 'Forbidden', {
                cause: 'You are not authorized to access this resource',
            })
            next(error)
            return
        }
        next()
    }
}
