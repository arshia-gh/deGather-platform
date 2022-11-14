import { Button, Label, TextInput } from "flowbite-react"

function SignUpForm() {
    return <form className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Sign Up
        </h3>

        <p className="text-sm text-gray-700 dark:text-white">
            Register and get access to one of the most advanced
            data gathering platforms
        </p>
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
                />
            </div>
        </div>
        <div className="w-full">
            <Button>
                Sign Up
            </Button>
        </div>
        <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Already have an account?{' '}
            <a
                href="/modal"
                className="text-blue-700 hover:underline dark:text-blue-500"
            >
                Login
            </a>
        </div>
    </form>
}

export default SignUpForm