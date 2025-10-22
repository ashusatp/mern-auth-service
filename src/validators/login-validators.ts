import { body } from 'express-validator'

export default [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .trim()
        .isEmail()
        .withMessage('Invalid email')
        .toLowerCase(),

    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .trim()
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long'),
]
