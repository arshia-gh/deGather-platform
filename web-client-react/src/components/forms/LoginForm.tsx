import { Button, Label, TextInput } from "flowbite-react"

function LoginForm() {
    return <form className="space-y-6 px-6 pb-4 sm:pb-6 lg:px-8 xl:pb-8">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white">
            Login
        </h3>
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
            />
        </div>
        <div className="w-full">
            <Button>
                Login
            </Button>
        </div>
        <hr className="my-8 h-px bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Don't have an account?{' '}
            <a
                href="/modal"
                className="text-blue-700 hover:underline dark:text-blue-500"
            >
                Sign Up
            </a>
        </div>
    </form>
}

export default LoginForm