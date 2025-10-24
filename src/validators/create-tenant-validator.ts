import { body } from 'express-validator'

export default [
    body('name')
        .notEmpty()
        .withMessage('Name is required')
        .trim()
        .isString()
        .withMessage('Name must be a string'),

    body('address')
        .notEmpty()
        .withMessage('Address is required')
        .trim()
        .isString()
        .withMessage('Address must be a string'),

    body('phone')
        .notEmpty()
        .withMessage('Phone is required')
        .trim()
        .isString()
        .withMessage('Phone must be a string')
        .isLength({ min: 10 })
        .withMessage('Phone must be at least 10 characters long'),

    body('domain').optional().isString().withMessage('Domain must be a string'),
]
