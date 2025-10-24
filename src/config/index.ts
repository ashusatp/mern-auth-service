import { config } from 'dotenv'
import path from 'path'

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
})

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    REFRESH_JWT_SECRET,
    REFRESH_JWT_EXPIRES_IN,
    CLIENT_UI_DOMAIN,
    ADMIN_UI_DOMAIN,
    JWKS_URI,
    PRIVATE_KEY,
} = process.env

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    CLIENT_UI_DOMAIN,
    ADMIN_UI_DOMAIN,
    REFRESH_JWT_SECRET,
    REFRESH_JWT_EXPIRES_IN,
    JWKS_URI,
    PRIVATE_KEY,
}
