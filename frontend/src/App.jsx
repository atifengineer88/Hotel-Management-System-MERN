import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookRoom from './pages/BookRoom';
import Housekeeping from './pages/Housekeeping';
import AdminRooms from './pages/AdminRooms';
import AdminBookings from './pages/AdminBookings';
import MyBookings from './pages/MyBookings';
import LandingPage from './pages/LandingPage'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} /> 
          <Route path="/login" element={<Login />} />  
          <Route path="/register" element={<Register />} />

          
          {/* Protected Routes Wrapper */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/book" element={<BookRoom />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              
              {/* Role Specific Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'housekeeping']} />}>
                 <Route path="/housekeeping" element={<Housekeeping />} />
              </Route>

              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                 <Route path="/admin/rooms" element={<AdminRooms />} />
                 <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/rooms" element={<AdminRooms />} />
              </Route>
            </Route>
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;