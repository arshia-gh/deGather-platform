import { FC, useState } from "react";
import { LoginForm } from "../components/forms/LoginForm";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faGoogle } from "@fortawesome/free-brands-svg-icons"
// import { faWallet } from "@fortawesome/free-solid-svg-icons"
// import { logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useNavigate } from "react-router-dom";
import SignUpForm from "../components/forms/SignUpForm";

const heroImage = new URL(
    '../assets/landing-hero-img.jpg',
    import.meta.url
)

const SignUpPage: FC = () => {
    const [isSignUpFailed, setSignUpFailed] = useState(false);
    const navigate = useNavigate();

    const onEmailLoginSubmit = (result: boolean) => {
        setSignUpFailed(result)
        if (!isSignUpFailed) {
            navigate('/');
        }
    }
    return <>
        <section
            className="mx-auto max-w-screen-xl px-4 py-10 flex flex-col lg:flex-row gap-8"
        >
            <div className="flex flex-col justify-between lg:w-4/12 w-full">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Sign Up
                </h3>
                <p className="text-sm text-gray-700 dark:text-white">
            Register and get access to one of the most advanced
            data gathering platforms
        </p>
                {isSignUpFailed && <div role="alert" className="my-2 rounded border-l-4 border-red-500 bg-red-50 p-4">
                    <p className="text-red-700">
                        Invalid login credentials
                    </p>
                </div>
                }
                <SignUpForm onSignUp={(res) => onEmailLoginSubmit(!!res)} />
            </div>
            <div className="lg:order-2 order-1 lg:w-8/12 w-full rounded-lg overflow-hidden">
                <img src={heroImage.href} alt="hero image" className="w-full h-full object-cover" />
            </div>
        </section>
    </>
}

export { SignUpPage }