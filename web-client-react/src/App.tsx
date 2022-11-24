import { 
  RouterProvider,
  createBrowserRouter, 
  createRoutesFromElements, 
  Route 
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import RootLayout from './pages/RootLayout';
import { SignUpPage } from './pages/SignUpPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/sign-up' element={<SignUpPage />} />
    </Route>
  )
)

export function App() {
  return <RouterProvider router={router} />
}

export default App;