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

    body('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .trim()
        .isLength({ min: 3 })
        .withMessage('First name must be at least 3 characters long'),

    body('lastName').notEmpty().withMessage('Last name is required').trim(),
]

// import { checkSchema } from 'express-validator'

// export default checkSchema({
//     email: {
//         notEmpty: {
//             errorMessage: 'Email is required',
//         },
//         isEmail: {
//             errorMessage: 'Invalid email',
//         },
//     },
//     password: {
//         notEmpty: {
//             errorMessage: 'Password is required',
//         },
//     },
//     firstName: {
//         notEmpty: {
//             errorMessage: 'First name is required',
//         },
//     },
//     lastName: {
//         notEmpty: {
//             errorMessage: 'Last name is required',
//         },
//     },
// })
