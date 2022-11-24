import { Button, Navbar } from 'flowbite-react';

import { useNavigate } from 'react-router-dom';
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

const logoUrl = new URL(
    '../../assets/degather-transparent-icon-logo.png',
    import.meta.url
).href

function MainNavigation() {
    const [user, loading, error] = useAuthState(auth)
    const navigate = useNavigate()

    return <>
        <Navbar
            fluid={true}
            rounded={true}
            className="mx-auto max-w-screen-xl"
        >
            <Navbar.Brand href="/">
                <img
                    src={logoUrl}
                    className="mr-3 h-6 sm:h-9 bg-slate-200 rounded-md p-1 sm:p-2"
                    alt="deGather Logo"
                />
                <span className="self-center whitespace-nowrap text-lg font-semibold dark:text-white">
                    de
                </span>
                <span className="self-center whitespace-nowrap text-lg font-semibold text-blue-600">
                    Gather
                </span>
            </Navbar.Brand>
            <div className="flex gap-2 md:order-2">
                {!user ? <>
                    <Button
                        outline={true}
                        gradientDuoTone="cyanToBlue"
                        onClick={() => navigate('/login')}
                    >
                        Login
                    </Button>
                    <Button gradientMonochrome="info" onClick={() => navigate('/sign-up')}>
                        Sign Up
                    </Button> </> :
                    <Button
                        color="dark"
                        onClick={() => signOut(auth)}
                    >
                        Logout
                    </Button>
                }
                <Navbar.Toggle />

            </div>
            <Navbar.Collapse>
                <Navbar.Link
                    href='/'
                    active={true}
                >
                    Home
                </Navbar.Link>
                <Navbar.Link href="#">
                    About
                </Navbar.Link>
                <Navbar.Link href="#">
                    Contact
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>

    </>
}

export default MainNavigation;