import { Request } from 'express'

export interface UserData {
    firstName: string
    lastName: string
    email: string
    password: string
}

export interface LoginUserData {
    email: string
    password: string
}

export interface RegisterUserRequest extends Request {
    body: UserData
}

export interface LoginUserRequest extends Request {
    body: LoginUserData
}

export interface AuthRequest extends Request {
    auth: {
        sub: string
        role: string
    }
}

export interface ITenant {
    name: string
    domain: string
    address: string
    phone: string
}

export interface ITenantUpdate {
    name?: string
    domain?: string
    address?: string
    phone?: string
}

export interface TenantUpdateRequest extends Request {
    body: ITenantUpdate
    params: {
        id: string
    }
}
