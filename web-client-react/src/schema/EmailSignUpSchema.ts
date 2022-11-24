import * as Yup from 'yup'

export const EmailSignUpSchema = Yup.object().shape({
    nickname: Yup.string().required(),
    tag: Yup.number().min(1000).max(9999),
    email: Yup.string().email().required(),
    password: Yup.string().required(),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match')
});