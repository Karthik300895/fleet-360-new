import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { NotFoundPage } from './NotFoundPage'
import { LoginPage } from '../features/login/LoginPage'
import { LandingPage } from '../features/landing/LandingPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
