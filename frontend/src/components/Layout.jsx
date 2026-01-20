import { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  Box, Drawer, AppBar, Toolbar, List, Typography, Divider, IconButton,
  ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, useTheme, Tooltip
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HotelIcon from '@mui/icons-material/Hotel';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import KingBedIcon from '@mui/icons-material/KingBed';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const drawerWidth = 260;

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    if(window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate('/');
    }
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'My Bookings', icon: <HistoryIcon />, path: '/my-bookings' },
    { text: 'Book a Suite', icon: <HotelIcon />, path: '/book' },
    
    // Admin / Manager Only
    ...(user?.role === 'admin' || user?.role === 'manager'
      ? [
          { type: 'divider' }, // Visual separator
          { text: 'Manage Bookings', icon: <ListAltIcon />, path: '/admin/bookings' }
        ] 
      : []),

    // Admin Only
    ...(user?.role === 'admin' 
        ? [{ text: 'Room Inventory', icon: <KingBedIcon />, path: '/admin/rooms' }] 
        : []),

    // Staff / Admin Only
    ...(user?.role === 'admin' || user?.role === 'housekeeping' 
        ? [{ text: 'Housekeeping', icon: <CleaningServicesIcon />, path: '/housekeeping' }] 
        : []),
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      
      {/* 1. Top Header (Glassmorphic AppBar) */}
      <AppBar 
        position="absolute" 
        open={open} 
        elevation={0}
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
          color: theme.palette.text.primary,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar sx={{ pr: '24px' }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            sx={{ marginRight: '36px', ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography 
            component="h1" 
            variant="h6" 
            color="primary" 
            noWrap 
            sx={{ flexGrow: 1, fontFamily: 'Playfair Display', fontWeight: 'bold', letterSpacing: 1 }}
          >
            LuxuryStay HMS
          </Typography>

          {/* User Profile Section */}
          <Box display="flex" alignItems="center" gap={2}>
            <Box textAlign="right" sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="body2" fontWeight="bold" color="textPrimary">
                {user?.name || 'Guest'}
              </Typography>
              <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'capitalize' }}>
                {user?.role || 'User'}
              </Typography>
            </Box>
            
            <Avatar 
              sx={{ 
                bgcolor: theme.palette.secondary.main, 
                width: 40, height: 40,
                boxShadow: '0 4px 12px rgba(197, 160, 89, 0.3)' 
              }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <AccountCircleIcon />}
            </Avatar>
            
            <Tooltip title="Logout">
              <IconButton color="default" onClick={handleLogout}>
                <LogoutIcon color="action" />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 2. Sidebar (Deep Navy Drawer) */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            backgroundColor: theme.palette.primary.main, // Deep Navy Background
            color: 'white',
            ...(!open && {
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
              width: theme.spacing(9),
            }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
            backgroundColor: 'rgba(0,0,0,0.1)' // Slightly darker top area
          }}
        >
          <IconButton onClick={toggleDrawer} sx={{ color: 'white' }}>
            <ChevronLeftIcon />
          </IconButton>
        </Toolbar>
        
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        
        <List component="nav" sx={{ mt: 2 }}>
          {menuItems.map((item, index) => {
            // Handle Divider
            if (item.type === 'divider') {
              return <Divider key={index} sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />;
            }

            const isActive = location.pathname === item.path;

            return (
              <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
                <ListItemButton
                  component={motion.div}
                  whileHover={{ scale: 1.02, x: 5 }}
                  sx={{
                    minHeight: 56,
                    justifyContent: open ? 'initial' : 'center',
                    px: 3,
                    mx: 1.5,
                    borderRadius: 2,
                    bgcolor: isActive ? theme.palette.secondary.main : 'transparent',
                    color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      bgcolor: isActive ? theme.palette.secondary.dark : 'rgba(255,255,255,0.08)',
                      color: 'white',
                    },
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2.5 : 'auto',
                      justifyContent: 'center',
                      color: isActive ? 'white' : 'inherit'
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text} 
                    primaryTypographyProps={{ 
                      fontSize: '0.95rem', 
                      fontWeight: isActive ? 600 : 400,
                      letterSpacing: 0.5 
                    }} 
                    sx={{ opacity: open ? 1 : 0 }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>

      {/* 3. Main Content Area */}
      <Box
        component="main"
        sx={{
          backgroundColor: '#f4f6f8', // Light Grey Background
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box 
          component={motion.div} 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          sx={{ p: 4 }}
        >
            <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;