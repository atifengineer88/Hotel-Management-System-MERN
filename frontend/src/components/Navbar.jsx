import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, letterSpacing: 1 }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
            LUXURYSTAY
          </Link>
        </Typography>

        {user ? (
          <Box>
            <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={Link} to="/book">Book Room</Button>
            <Button 
              color="error" 
              variant="contained" 
              onClick={handleLogout} 
              startIcon={<LogoutIcon />}
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;