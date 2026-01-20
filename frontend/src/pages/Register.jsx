import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, TextField, Button, 
  Paper, Alert, CircularProgress, Grid, InputAdornment, useTheme, IconButton 
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { name: '', email: '', password: '' },
    validationSchema: Yup.object({
      name: Yup.string().min(3, 'Name too short').required('Full Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await register(values);
        navigate('/'); // Redirect to Login
      } catch (error) {
        setStatus(error.response?.data?.msg || 'Registration failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundImage: 'url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")', // Different Luxury Hotel Image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {/* Dark Overlay */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid 
          container 
          component={motion.div} 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.8, type: 'spring' }}
          sx={{ boxShadow: '0 30px 60px rgba(0,0,0,0.35)', borderRadius: 4, overflow: 'hidden' }}
        >
          
          {/* LEFT SIDE: Brand / Welcome */}
          <Grid item xs={12} md={5} sx={{ 
            bgcolor: theme.palette.secondary.main, // Gold Background
            color: 'white', 
            p: 6, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
             {/* Decorative Circles */}
             <Box sx={{ 
              position: 'absolute', top: -80, left: -80, width: 250, height: 250, 
              borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)' 
            }} />
            <Box sx={{ 
              position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, 
              borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' 
            }} />

            <Box position="relative" zIndex={2}>
              <Typography variant="overline" sx={{ letterSpacing: 3, opacity: 0.9, fontWeight: 'bold' }}>
                Join the Elite
              </Typography>
              <Typography variant="h3" fontWeight="700" fontFamily="Playfair Display" sx={{ mb: 3 }}>
                Unlock Luxury
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9, lineHeight: 1.8 }}>
                Create your account to unlock exclusive rates, manage your bookings, and experience personalized hospitality like never before.
              </Typography>
            </Box>
          </Grid>

          {/* RIGHT SIDE: Form */}
          <Grid item xs={12} md={7} component={Paper} elevation={0} sx={{ p: { xs: 4, md: 8 }, bgcolor: 'rgba(255,255,255,0.95)' }}>
            <Box mb={4}>
              <Typography variant="h4" fontWeight="bold" color="primary">Become a Member</Typography>
              <Typography variant="body2" color="textSecondary">Fill in your details to create your guest profile.</Typography>
            </Box>

            {formik.status && (
              <Box component={motion.div} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} mb={3}>
                <Alert severity="error">{formik.status}</Alert>
              </Box>
            )}

            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Full Name"
                placeholder="John Doe"
                margin="normal"
                autoComplete="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <BadgeIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                placeholder="guest@example.com"
                margin="normal"
                autoComplete="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Create Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                autoComplete="new-password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClickShowPassword} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                size="large"
                disabled={formik.isSubmitting}
                startIcon={!formik.isSubmitting && <PersonAddIcon />}
                sx={{ 
                  mt: 4, 
                  mb: 3, 
                  height: 56, 
                  borderRadius: 2, 
                  fontSize: '1rem',
                  textTransform: 'none',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)'
                }}
              >
                {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  Already have a membership?{' '}
                  <Link to="/login" style={{ textDecoration: 'none', color: theme.palette.secondary.main, fontWeight: 'bold' }}>
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </form>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Register;