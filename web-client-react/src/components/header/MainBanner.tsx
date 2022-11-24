import { Button } from "flowbite-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";

const heroImage = new URL(
    '../../assets/landing-hero-img.jpg',
    import.meta.url
)

function MainBanner() {
    const navigate = useNavigate()
    const [user] = useAuthState(auth)

    return (
        <section
            className="mx-auto max-w-screen-xl px-4 py-10 flex flex-col items-center lg:flex-row gap-8"
        >
            <div className="lg:order-1 order-2 lg:w-5/12 w-full mr-auto lg:text-left text-center">
                <h1 className="text-3xl font-extrabold sm:text-5xl">
                    <strong className="font-extrabold text-blue-600 block lg:inline">
                        Decentralized
                    </strong>{" "}
                    Data Gathering Platform
                </h1>

                <p className="mt-4 sm:text-xl sm:leading-relaxed">
                    A trustless, reliable, and transparent solution all of your data gathering needs
                </p>

                <div className="mt-8 flex flex-wrap items-center lg:justify-start justify-center gap-3">
                    { !user && <Button gradientDuoTone="cyanToBlue" onClick={() => navigate('/login')}>
                        Get Started
                    </Button> }

                    <Button color="dark">
                        Why Decentralized?
                    </Button>
                </div>
            </div>
            <div className="lg:order-2 order-1 lg:w-6/12 w-full rounded-lg overflow-hidden">
                <img src={heroImage.href} alt="hero image" className="w-full h-auto object-fill" />
            </div>
        </section>
    )
}

export default MainBanner;