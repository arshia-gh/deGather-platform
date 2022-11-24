import { Button, Label, TextInput } from "flowbite-react"
import { FC } from "react"
import { Formik } from "formik"

import { EmailLoginSchema } from "../../schema/EmailLoginSchema"
import { logInWithEmailAndPassword } from "../../firebase"
import { UserCredential } from "firebase/auth"
import { Link } from "react-router-dom"

interface Props {
    onLogin: (user?: UserCredential) => void
}

const LoginForm: FC<Props> = ({ onLogin }) => {
    return <Formik 
    initialValues={{email: "", password: "" }}
    validationSchema={EmailLoginSchema}
    onSubmit={async ({ email, password }, { resetForm }) => {
        const result = await logInWithEmailAndPassword(email, password);
        if (!result) resetForm()
        onLogin(result);
    }}
    >
        {({ errors, touched, handleSubmit, handleBlur, handleChange, values, isValid }) => 
        <>
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="email"
                        value="Your email"
                    />
                </div>
                <TextInput
                    id="email"
                    placeholder="name@company.com"
                    required={true}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                />
                { errors.email && touched.email ? (
                    <div>{ errors.email }</div>
                ) : null}
            </div>
            <div>
                <div className="md:mb-2">
                    <Label
                        htmlFor="password"
                        value="Password"
                    />
                </div>
                <TextInput
                    id="password"
                    type="password"
                    required={true}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                />
                { errors.password && touched.password ? (
                    <div>{ errors.password }</div>
                ) : null}
            </div>
            <div className="w-full">
                <Button type="submit" disabled={!(touched.password && touched.email && isValid)}>
                    Login
                </Button>
            </div>
        </form>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
        Don't have an account?{' '}
        <Link
            to="/sign-up"
            className="text-blue-700 hover:underline dark:text-blue-500"
        >
            Sign Up
        </Link>
    </div>
    </>
}
    </Formik>
}

export { LoginForm }