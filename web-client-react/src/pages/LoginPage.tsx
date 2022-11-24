import { FC, useState } from "react";
import { LoginForm } from "../components/forms/LoginForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { faWallet } from "@fortawesome/free-solid-svg-icons"
import { logInWithEmailAndPassword, signInWithGoogle } from "../firebase";
import { useNavigate } from "react-router-dom";

const heroImage = new URL(
    '../assets/landing-hero-img.jpg',
    import.meta.url
)

const LoginPage: FC = () => {
    const [isLoginFailed, setLoginFailed] = useState(false);
    const navigate = useNavigate();

    const onEmailLoginSubmit = (result: boolean) => {
        setLoginFailed(result)
        if (!isLoginFailed) {
            navigate('/');
        }
    }
    return <>
        <section
            className="mx-auto max-w-screen-xl px-4 py-10 flex flex-col lg:flex-row gap-8"
        >
            <div className="flex flex-col justify-between lg:w-4/12 w-full">
                <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                    Login
                </h3>
                {isLoginFailed && <div role="alert" className="my-2 rounded border-l-4 border-red-500 bg-red-50 p-4">
                    <p className="text-red-700">
                        Invalid login credentials
                    </p>
                </div>
                }
                <LoginForm onLogin={(res) => onEmailLoginSubmit(!!res)} />
                <hr className="border-gray-100" />
                <div className="flex flex-col gap-2">
                    <button
                        className="
        inline-flex items-center
        rounded border-2 border-[#de5246] bg-[#de5246] 
        px-5 py-2 text-sm font-medium text-white 
        transition-colors hover:bg-transparent 
        hover:text-[#de5246] focus:outline-none 
        focus:ring active:opacity-75
        "
                    >
                        <FontAwesomeIcon className="h-4 w-4" icon={faGoogle} />
                        <span className="mx-auto">Continue with Google</span>
                    </button>
                    <button
                        className="
        inline-flex items-center
        rounded border-2 border-gray-800 bg-gray-800 
        px-5 py-2 text-sm font-medium text-white 
        transition-colors hover:bg-transparent 
        hover:text-gray-800 focus:outline-none 
        focus:ring active:opacity-75
        "
                    >
                        <FontAwesomeIcon className="h-4 w-4" icon={faWallet} />
                        <span className="mx-auto">Continue with Secret Key</span>
                    </button>
                </div>
            </div>
            <div className="lg:order-2 order-1 lg:w-8/12 w-full rounded-lg overflow-hidden">
                <img src={heroImage.href} alt="hero image" className="w-full h-full object-cover" />
            </div>
        </section>
    </>
}

export { LoginPage }