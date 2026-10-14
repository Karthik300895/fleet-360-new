import { createBrowserRouter } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { NotFoundPage } from './NotFoundPage'
import { LoginPage } from '../features/login/LoginPage'
import { LandingPage } from '../features/landing/LandingPage'
import { ApplicationShell } from '../features/shell/ApplicationShell'
import { ComingSoonPage } from '../features/shell/ComingSoonPage'
import { DevicesRouteLayout } from '../features/devices/DevicesRouteLayout'
import { DevicesListPage } from '../features/devices/DevicesListPage'
import { DeviceDetailPage } from '../features/devices/DeviceDetailPage'
import { DeviceUploadPage } from '../features/devices/DeviceUploadPage'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ComingSoonPage title="Forgot Password" />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        element: <ApplicationShell />,
        children: [
          {
            path: 'dashboard',
            element: <ComingSoonPage title="Dashboard" />,
          },
          {
            path: 'devices',
            element: <DevicesRouteLayout />,
            children: [
              {
                index: true,
                element: <DevicesListPage />,
              },
              {
                path: 'upload',
                element: <DeviceUploadPage />,
              },
              {
                path: ':deviceId/:tab?',
                element: <DeviceDetailPage />,
              },
            ],
          },
          {
            path: 'sites',
            element: <ComingSoonPage title="Sites" />,
          },
          {
            path: 'users',
            element: <ComingSoonPage title="Users" />,
          },
          {
            path: 'alarms',
            element: <ComingSoonPage title="Alarms" />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
