import { FC } from 'react'
import { Button, Label, TextInput } from "flowbite-react"
import { Link } from 'react-router-dom'
import { Formik } from 'formik'
import { EmailSignUpSchema } from '../../schema/EmailSignUpSchema'
import { signUpWithEmailAndPassword } from '../../firebase'

interface Props {
    onSignUp: (user?: string) => void
}
const SignUpForm: FC<Props> = ({ onSignUp }) => {
    return <><Formik 
    initialValues={{email: "", password: "", nickname: "", tag: "", confirmPassword: "" }}
    validationSchema={EmailSignUpSchema}
    onSubmit={async ({ nickname, tag, email, password }, { resetForm }) => {
        const result = await signUpWithEmailAndPassword(nickname, tag, email, password);
        if (!result) resetForm()
        onSignUp(result);
    }}
    >
    {({ errors, touched, handleSubmit, handleBlur, handleChange, values, isValid }) => 
    (<form className="space-y-6 pt-4">
        <div className="flex gap-4 flex-col md:flex-row">
            <div>
                <div className="mb-2 block">
                    <Label
                        htmlFor="nickname"
                        value="Nickname"
                    />
                </div>
                <TextInput
                    id="nickname"
                    type="text"
                    required={true}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.nickname}
                />
            </div>
            <div>
                <div className="md:mb-2">
                    <Label
                        htmlFor="tag"
                        value="Tag"
                    />
                </div>
                <TextInput
                    id="tag"
                    type="text"
                    required={true}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.tag}
                />
            </div>
        </div>
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
        </div>
        <div className="flex gap-4 flex-col md:flex-row">
            <div>
                <div className="mb-2 block">
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
            </div>
            <div>
                <div className="md:mb-2">
                    <Label
                        htmlFor="confirmPassword"
                        value="Confirm Password"
                    />
                </div>
                <TextInput
                    id="confirmPassword"
                    type="password"
                    required={true}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.confirmPassword}
                />
            </div>
        </div>
        <div className="w-full">
            <Button>
                Sign Up
            </Button>
        </div>  
    </form>
    )}
    </Formik>

<hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />
    <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
        Already have an account?{' '}
        <Link
            to="/login"
            className="text-blue-700 hover:underline dark:text-blue-500"
        >
            Login
        </Link>
    </div>
    </>
}

export default SignUpForm