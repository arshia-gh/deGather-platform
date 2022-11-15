import { 
  RouterProvider,
  createBrowserRouter, 
  createRoutesFromElements, 
  Route 
} from 'react-router-dom';
import HomePage from './pages/HomePage';
import RootLayout from './pages/RootLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<RootLayout />}>
      <Route index element={<HomePage />} />
    </Route>
  )
)

export function App() {
  return <RouterProvider router={router} />
}

export default App;