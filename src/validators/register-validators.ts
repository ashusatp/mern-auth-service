import { body } from 'express-validator'

export default [
    body('email')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
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
