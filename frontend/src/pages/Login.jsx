import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, Box, Typography, TextField, Button, 
  Paper, Alert, CircularProgress, Grid, InputAdornment, useTheme, IconButton 
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import LoginIcon from '@mui/icons-material/Login';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from 'react';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        await login(values.email, values.password);
        navigate('/dashboard');
      } catch (error) {
        console.error("Login failed:", error);
        setStatus(error.response?.data?.msg || 'Server not responding. Is Backend running?');
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
        backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative'
      }}
    >
      {/* Dark Overlay */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Grid 
          container 
          component={motion.div} 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, type: 'spring' }}
          sx={{ boxShadow: '0 25px 50px rgba(0,0,0,0.3)', borderRadius: 4, overflow: 'hidden' }}
        >
          
          {/* LEFT SIDE: Brand / Welcome */}
          <Grid item xs={12} md={6} sx={{ 
            bgcolor: theme.palette.primary.main, 
            color: 'white', 
            p: 6, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Abstract Decoration */}
            <Box sx={{ 
              position: 'absolute', top: -50, right: -50, width: 200, height: 200, 
              borderRadius: '50%', border: `1px solid ${theme.palette.secondary.main}`, opacity: 0.2 
            }} />
            <Box sx={{ 
              position: 'absolute', bottom: -50, left: -50, width: 300, height: 300, 
              borderRadius: '50%', bgcolor: theme.palette.secondary.main, opacity: 0.1 
            }} />

            <Box position="relative" zIndex={2}>
              <Typography variant="overline" color="secondary" letterSpacing={3} fontWeight="bold">
                Staff & Admin Portal
              </Typography>
              <Typography variant="h2" fontWeight="700" fontFamily="Playfair Display" sx={{ mb: 2 }}>
                LuxuryStay
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8, lineHeight: 1.7, maxWidth: 400 }}>
                Welcome back. Access the dashboard to manage reservations, view room status, and ensure our guests have an unforgettable experience.
              </Typography>
            </Box>
          </Grid>

          {/* RIGHT SIDE: Login Form */}
          <Grid item xs={12} md={6} component={Paper} elevation={0} sx={{ p: { xs: 4, md: 8 }, bgcolor: 'rgba(255,255,255,0.95)' }}>
            <Box textAlign="center" mb={4}>
              <Typography variant="h4" fontWeight="bold" color="textPrimary">Sign In</Typography>
              <Typography variant="body2" color="textSecondary">Please enter your credentials</Typography>
            </Box>

            {formik.status && (
              <Box component={motion.div} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} mb={3}>
                <Alert severity="error">{formik.status}</Alert>
              </Box>
            )}

            <form onSubmit={formik.handleSubmit}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                placeholder="staff@luxurystay.com"
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
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                autoComplete="current-password"
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
                startIcon={!formik.isSubmitting && <LoginIcon />}
                sx={{ 
                  mt: 4, 
                  mb: 3, 
                  height: 56, 
                  borderRadius: 2, 
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 8px 16px rgba(26, 35, 126, 0.2)'
                }}
              >
                {formik.isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Access Dashboard'}
              </Button>

              <Box textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?{' '}
                  <Link to="/register" style={{ textDecoration: 'none', color: theme.palette.primary.main, fontWeight: 'bold' }}>
                    Register Here
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

export default Login;



// import { useFormik } from 'formik';
// import * as Yup from 'yup';
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';

// const Login = () => {
//   const { login } = useContext(AuthContext);
//   const navigate = useNavigate();

//   // Formik Configuration
//   const formik = useFormik({
//     initialValues: { 
//       email: '', 
//       password: '' 
//     },
//     validationSchema: Yup.object({
//       email: Yup.string()
//         .email('Invalid email address')
//         .required('Email is required'),
//       password: Yup.string()
//         .required('Password is required'),
//     }),
//     onSubmit: async (values, { setSubmitting }) => {
//       try {
//         await login(values.email, values.password);
//         navigate('/dashboard'); // Redirect to dashboard on success
//       } catch (error) {
//         // Error is handled by toast in AuthContext, 
//         // but we catch it here to stop the loading state.
//         console.error("Login Error:", error);
//       } finally {
//         setSubmitting(false);
//       }
//     },
//   });

//   return (
//     <div className="flex h-screen w-full bg-slate-50">
//       {/* Left Side - Hero Image */}
//       <div className="hidden lg:flex w-1/2 bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')" }}>
//         <div className="absolute inset-0 bg-black/40 flex items-end p-12">
//           <div className="text-white">
//             <h1 className="text-4xl font-bold mb-2">Welcome Back.</h1>
//             <p className="text-lg text-slate-200">Manage your luxury stay experience with ease.</p>
//           </div>
//         </div>
//       </div>

//       {/* Right Side - Login Form */}
//       <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
//         <motion.div 
//           initial={{ opacity: 0, x: 20 }} 
//           animate={{ opacity: 1, x: 0 }} 
//           className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl"
//         >
//           <div className="mb-8 text-center">
//              <h2 className="text-3xl font-bold text-slate-800">Sign In</h2>
//              <p className="text-slate-500 mt-2">Access your LuxuryStay account</p>
//           </div>
          
//           <form onSubmit={formik.handleSubmit} className="space-y-5">
            
//             {/* Email Field */}
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
//                 Email Address
//               </label>
//               <input
//                 id="email"
//                 type="email"
//                 name="email"
//                 autoComplete="email" 
//                 {...formik.getFieldProps('email')}
//                 className={`w-full px-4 py-3 rounded-lg border ${
//                   formik.touched.email && formik.errors.email 
//                     ? 'border-red-500 ring-1 ring-red-500' 
//                     : 'border-slate-300'
//                 } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
//                 placeholder="you@example.com"
//               />
//               {formik.touched.email && formik.errors.email && (
//                 <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.email}</p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
//                 Password
//               </label>
//               <input
//                 id="password"
//                 type="password"
//                 name="password"
//                 autoComplete="current-password"
//                 {...formik.getFieldProps('password')}
//                 className={`w-full px-4 py-3 rounded-lg border ${
//                   formik.touched.password && formik.errors.password 
//                     ? 'border-red-500 ring-1 ring-red-500' 
//                     : 'border-slate-300'
//                 } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all`}
//                 placeholder="••••••••"
//               />
//               {formik.touched.password && formik.errors.password && (
//                 <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.password}</p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={formik.isSubmitting}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all 
//                 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 flex justify-center items-center"
//             >
//               {formik.isSubmitting ? (
//                 <span className="flex items-center gap-2">
//                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Signing in...
//                 </span>
//               ) : 'Sign In'}
//             </button>
//           </form>

//           <p className="mt-8 text-center text-slate-600">
//             Don't have an account?{' '}
//             <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline transition-all">
//               Register here
//             </Link>
//           </p>
//         </motion.div>
//       </div>
//     </div>
//   );
// };

// export default Login;