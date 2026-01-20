import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { 
  Container, Typography, TextField, Button, MenuItem, 
  Paper, Grid, Alert, CircularProgress, Box, InputAdornment, useTheme 
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import KingBedIcon from '@mui/icons-material/KingBed';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DescriptionIcon from '@mui/icons-material/Description';
import NumbersIcon from '@mui/icons-material/Numbers';

const roomTypes = ['Single', 'Double', 'Suite', 'Deluxe', 'Penthouse'];

const AdminRooms = () => {
  const [msg, setMsg] = useState({ type: '', text: '' });
  const theme = useTheme();

  const formik = useFormik({
    initialValues: { roomNumber: '', type: '', price: '', description: '' },
    validationSchema: Yup.object({
      roomNumber: Yup.string().required('Room Number is required'),
      type: Yup.string().required('Room Type is required'),
      price: Yup.number().positive('Must be positive').required('Price is required'),
      description: Yup.string()
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/rooms', values, {
          headers: { 'x-auth-token': token }
        });
        setMsg({ type: 'success', text: 'Room added successfully to Inventory!' });
        resetForm();
      } catch (err) {
        setMsg({ type: 'error', text: err.response?.data?.msg || 'Failed to add room' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
      <Paper 
        component={motion.div}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        elevation={0} 
        sx={{ 
          p: 6, 
          borderRadius: 4, 
          border: '1px solid rgba(0,0,0,0.08)',
          background: 'linear-gradient(145deg, #ffffff 0%, #f9f9f9 100%)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.05)'
        }}
      >
        {/* Header Section */}
        <Box mb={5} textAlign="center">
          <Typography 
            variant="overline" 
            fontWeight="bold" 
            color="secondary" 
            sx={{ letterSpacing: 2 }}
          >
            Inventory Management
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight="bold" 
            color="primary" 
            sx={{ fontFamily: 'Playfair Display', mt: 1 }}
          >
            Add New Suite
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mt: 1, maxWidth: 500, mx: 'auto' }}>
            Expand your luxury collection by adding detailed room configurations below.
          </Typography>
        </Box>

        {/* Alerts */}
        {msg.text && (
          <Box component={motion.div} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} mb={4}>
            <Alert severity={msg.type} variant="filled" sx={{ borderRadius: 2 }}>
              {msg.text}
            </Alert>
          </Box>
        )}

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={4}>
            
            {/* Room Number */}
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}>
              <TextField
                fullWidth
                id="roomNumber"
                name="roomNumber"
                label="Room Number"
                placeholder="e.g. 101"
                value={formik.values.roomNumber}
                onChange={formik.handleChange}
                error={formik.touched.roomNumber && Boolean(formik.errors.roomNumber)}
                helperText={formik.touched.roomNumber && formik.errors.roomNumber}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <NumbersIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Room Type */}
            <Grid item xs={12} sm={6} component={motion.div} variants={itemVariants}>
              <TextField
                select
                fullWidth
                id="type"
                name="type"
                label="Suite Category"
                value={formik.values.type}
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
                helperText={formik.touched.type && formik.errors.type}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <KingBedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              >
                {roomTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Price */}
            <Grid item xs={12} component={motion.div} variants={itemVariants}>
              <TextField
                fullWidth
                type="number"
                id="price"
                name="price"
                label="Price per Night"
                placeholder="0.00"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12} component={motion.div} variants={itemVariants}>
              <TextField
                fullWidth
                multiline
                rows={4}
                id="description"
                name="description"
                label="Room Description"
                placeholder="Describe views, amenities, and unique features..."
                value={formik.values.description}
                onChange={formik.handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                      <DescriptionIcon color="action" />
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
                startIcon={!formik.isSubmitting && <AddBusinessIcon />}
                sx={{ 
                  py: 1.8, 
                  fontSize: '1rem',
                  borderRadius: 3,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.light} 90%)`,
                  boxShadow: '0 6px 20px rgba(26, 35, 126, 0.25)'
                }}
              >
                {formik.isSubmitting ? <CircularProgress size={26} color="inherit" /> : 'Add Room to Inventory'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminRooms;