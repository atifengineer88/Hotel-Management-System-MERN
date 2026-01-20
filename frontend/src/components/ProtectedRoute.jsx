import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // 1. If no user is logged in -> Redirect to Login
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // 2. If roles are specified and user doesn't match -> Redirect to Dashboard (or 403)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // 3. User is authorized -> Render the page
  return <Outlet />;
};

export default ProtectedRoute;