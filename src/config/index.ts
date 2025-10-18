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
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ADMIN_USER_TOKEN,
    CLIENT_UI_DOMAIN,
    ADMIN_UI_DOMAIN,
} = process.env

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ADMIN_USER_TOKEN,
    CLIENT_UI_DOMAIN,
    ADMIN_UI_DOMAIN,
}
