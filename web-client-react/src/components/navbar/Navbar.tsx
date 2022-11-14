import { Button, Modal, Navbar as FbNavbar } from 'flowbite-react';
import { useState } from 'react';
import LoginForm from '../forms/LoginForm';
import SignUpForm from '../forms/SignUpForm';

const logoUrl = new URL(
    '../../assets/degather-transparent-icon-logo.png',
    import.meta.url
).href

function Navbar() {
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    return <>
        <FbNavbar
            fluid={true}
            rounded={true}
            className="mx-auto max-w-screen-xl"
        >
            <FbNavbar.Brand href="/">
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
            </FbNavbar.Brand>
            <div className="flex md:order-2 gap-2">
                <Button outline={true} gradientDuoTone="cyanToBlue" onClick={() => setShowLogin(true)}>
                    Login
                </Button>
                <Button gradientMonochrome="info" onClick={() => setShowSignUp(true)}>
                    Sign Up
                </Button>
                <FbNavbar.Toggle />
            </div>
            <FbNavbar.Collapse>
                <FbNavbar.Link
                    href="/navbars"
                    active={true}
                >
                    Home
                </FbNavbar.Link>
                <FbNavbar.Link href="/navbars">
                    About
                </FbNavbar.Link>
                <FbNavbar.Link href="/navbars">
                    Contact
                </FbNavbar.Link>
            </FbNavbar.Collapse>
        </FbNavbar>
        <Modal
            show={showSignUp}
            size="xl"
            popup={true}
            onClose={() => setShowSignUp(false)}>
            <Modal.Header />
            <Modal.Body>
                <SignUpForm />
            </Modal.Body>
        </Modal>
        <Modal
            show={showLogin}
            size="lg"
            popup={true}
            onClose={() => setShowLogin(false)}>
            <Modal.Header />
            <Modal.Body>
                <LoginForm />
            </Modal.Body>
        </Modal>
    </>
}

export default Navbar;