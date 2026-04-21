import { createBrowserRouter, Navigate } from 'react-router';
import Landing from './pages/Landing';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import Templates from './pages/Templates';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/about',
    element: <AboutUs />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/messages',
    element: (
      <ProtectedRoute>
        <Messages />
      </ProtectedRoute>
    ),
  },
  {
    path: '/analytics',
    element: (
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: '/templates',
    element: (
      <ProtectedRoute>
        <Templates />
      </ProtectedRoute>
    ),
  },
  {
    path: '/settings',
    element: (
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);