import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { 
  Container, Typography, TextField, Button, MenuItem, 
  Paper, Grid, Alert, CircularProgress, Box, InputAdornment, useTheme, Divider 
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import KingBedIcon from '@mui/icons-material/KingBed';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PersonIcon from '@mui/icons-material/Person';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import NotesIcon from '@mui/icons-material/Notes';

const BookRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');
  const theme = useTheme();

  // Fetch available rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/rooms');
        setRooms(res.data.filter(r => r.status === 'available'));
      } catch (err) {
        console.error("Error fetching rooms");
      }
    };
    fetchRooms();
  }, []);

  const formik = useFormik({
    initialValues: { 
      roomId: '', 
      checkInDate: '', 
      checkOutDate: '',
      adults: 1,
      children: 0,
      specialRequests: ''
    },
    validationSchema: Yup.object({
      roomId: Yup.string().required('Please select a luxury suite'),
      checkInDate: Yup.date().required('Check-in date is required').min(new Date(), 'Date cannot be in the past'),
      checkOutDate: Yup.date().required('Check-out date is required').min(Yup.ref('checkInDate'), 'Check-out must be after check-in'),
      adults: Yup.number().min(1, 'At least 1 adult required').required('Required'),
      children: Yup.number().min(0, 'Cannot be negative'),
      specialRequests: Yup.string()
    }),
    onSubmit: async (values, { resetForm, setStatus, setSubmitting }) => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/bookings', values, {
          headers: { 'x-auth-token': token }
        });
        setSuccessMsg('Reservation Confirmed! We look forward to hosting you.');
        resetForm();
      } catch (err) {
        setStatus(err.response?.data?.msg || 'Booking failed');
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
      <Paper 
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        elevation={0} 
        sx={{ 
          p: { xs: 3, md: 6 }, 
          borderRadius: 4, 
          borderTop: `6px solid ${theme.palette.secondary.main}`,
          background: 'linear-gradient(145deg, #ffffff 0%, #fcfcfc 100%)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.08)'
        }}
      >
        {/* Header */}
        <Box textAlign="center" mb={5}>
          <Typography variant="overline" color="secondary" fontWeight="bold" letterSpacing={3}>
            LuxuryStay Hospitality
          </Typography>
          <Typography variant="h3" color="primary" sx={{ fontFamily: 'Playfair Display', fontWeight: 700, mt: 1 }}>
            Secure Your Reservation
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 2, maxWidth: '600px', mx: 'auto' }}>
            Select your dates and preferred suite. Our concierge team will ensure your stay is nothing short of perfection.
          </Typography>
        </Box>

        <Divider sx={{ mb: 5, opacity: 0.6 }} />

        {successMsg && (
          <Box component={motion.div} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} mb={4}>
            <Alert severity="success" variant="filled" sx={{ borderRadius: 2 }}>{successMsg}</Alert>
          </Box>
        )}
        
        {formik.status && (
          <Box component={motion.div} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} mb={4}>
            <Alert severity="error" variant="filled" sx={{ borderRadius: 2 }}>{formik.status}</Alert>
          </Box>
        )}

        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            
            {/* Room Selection */}
            <Grid item xs={12} component={motion.div} variants={itemVariants}>
              <TextField
                select
                fullWidth
                id="roomId"
                name="roomId"
                label="Select Your Suite"
                value={formik.values.roomId}
                onChange={formik.handleChange}
                error={formik.touched.roomId && Boolean(formik.errors.roomId)}
                helperText={formik.touched.roomId && formik.errors.roomId}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KingBedIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              >
                <MenuItem value="">
                  <em>Select a Suite</em>
                </MenuItem>
                {rooms.map((room) => (
                  <MenuItem key={room._id} value={room._id}>
                    <Box display="flex" justifyContent="space-between" width="100%">
                      <Typography fontWeight="bold">{room.type} - {room.roomNumber}</Typography>
                      <Typography color="secondary">${room.price} / night</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Check In Date */}
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}>
              <TextField
                fullWidth
                type="date"
                id="checkInDate"
                name="checkInDate"
                label="Check-In Date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.checkInDate}
                onChange={formik.handleChange}
                error={formik.touched.checkInDate && Boolean(formik.errors.checkInDate)}
                helperText={formik.touched.checkInDate && formik.errors.checkInDate}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Check Out Date */}
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}>
              <TextField
                fullWidth
                type="date"
                id="checkOutDate"
                name="checkOutDate"
                label="Check-Out Date"
                InputLabelProps={{ shrink: true }}
                value={formik.values.checkOutDate}
                onChange={formik.handleChange}
                error={formik.touched.checkOutDate && Boolean(formik.errors.checkOutDate)}
                helperText={formik.touched.checkOutDate && formik.errors.checkOutDate}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Guests: Adults */}
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}>
               <TextField
                fullWidth
                type="number"
                id="adults"
                name="adults"
                label="Adults"
                value={formik.values.adults}
                onChange={formik.handleChange}
                error={formik.touched.adults && Boolean(formik.errors.adults)}
                helperText={formik.touched.adults && formik.errors.adults}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Guests: Children */}
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}>
               <TextField
                fullWidth
                type="number"
                id="children"
                name="children"
                label="Children"
                value={formik.values.children}
                onChange={formik.handleChange}
                error={formik.touched.children && Boolean(formik.errors.children)}
                helperText={formik.touched.children && formik.errors.children}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <ChildCareIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Special Requests */}
            <Grid item xs={12} component={motion.div} variants={itemVariants}>
              <TextField
                fullWidth
                multiline
                rows={3}
                id="specialRequests"
                name="specialRequests"
                label="Special Requests (Optional)"
                placeholder="Early check-in, dietary restrictions, champagne on arrival..."
                value={formik.values.specialRequests}
                onChange={formik.handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                      <NotesIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} component={motion.div} variants={itemVariants} sx={{ mt: 2 }}>
              <Button 
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                variant="contained" 
                size="large" 
                fullWidth
                disabled={formik.isSubmitting}
                startIcon={!formik.isSubmitting && <EventAvailableIcon />}
                sx={{ 
                  py: 2, 
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  boxShadow: '0 8px 25px rgba(26, 35, 126, 0.3)'
                }}
              >
                {formik.isSubmitting ? <CircularProgress size={26} color="inherit" /> : 'Confirm Reservation'}
              </Button>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default BookRoom;