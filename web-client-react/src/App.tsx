import './App.css'

import { Modal } from 'flowbite-react';

import SignUpForm from './components/forms/SignUpForm';
import MainBanner from './components/header/MainBanner';
import Navbar from './components/navbar/Navbar'

export function App() {
  return <>
    <header>
      <Navbar />
      <MainBanner />
    </header>
  </>
}

export default App;