import * as Yup from 'yup'

export const EmailLoginSchema = Yup.object().shape({
    email: Yup.string().email().required(),
    password: Yup.string().required()
});