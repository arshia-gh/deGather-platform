import { Button, Modal, Navbar } from 'flowbite-react';
import { useState } from 'react';
import LoginForm from '../forms/LoginForm';
import SignUpForm from '../forms/SignUpForm';

const logoUrl = new URL(
    '../../assets/degather-transparent-icon-logo.png',
    import.meta.url
).href

function MainNavigation() {
    const [showSignUp, setShowSignUp] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

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
            <div className="flex md:order-2 gap-2">
                <Button outline={true} gradientDuoTone="cyanToBlue" onClick={() => setShowLogin(true)}>
                    Login
                </Button>
                <Button gradientMonochrome="info" onClick={() => setShowSignUp(true)}>
                    Sign Up
                </Button>
                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link
                    href="/navbars"
                    active={true}
                >
                    Home
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    About
                </Navbar.Link>
                <Navbar.Link href="/navbars">
                    Contact
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
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

export default MainNavigation;