import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, Chip, Box, CircularProgress, 
  Paper, Button, IconButton, Tooltip, Divider, useTheme, Avatar 
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import EventIcon from '@mui/icons-material/Event';
import KingBedIcon from '@mui/icons-material/KingBed';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import LuggageIcon from '@mui/icons-material/Luggage';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/bookings/my-bookings', {
          headers: { 'x-auth-token': token }
        });
        setBookings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyBookings();
  }, []);

  // Helpers
  const getStatusColor = (status) => {
    switch(status) {
      case 'booked': return theme.palette.primary.main; // Navy for active
      case 'checked_in': return theme.palette.success.main;
      case 'checked_out': return theme.palette.secondary.main; // Gold for completed
      case 'cancelled': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  const isPast = (status) => ['checked_out', 'cancelled'].includes(status);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
      
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5} component={motion.div} initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}>
        <Box>
          <Typography variant="overline" color="secondary" fontWeight="bold" letterSpacing={1}>
            Guest Portal
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ fontFamily: 'Playfair Display' }}>
            My Reservations
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => navigate('/book')}
          sx={{ borderRadius: 4, px: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
        >
          New Booking
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress size={60} thickness={4} color="secondary" />
        </Box>
      ) : bookings.length === 0 ? (
        /* Empty State */
        <Paper 
          component={motion.div}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          elevation={0}
          sx={{ 
            p: 8, 
            textAlign: 'center', 
            borderRadius: 4, 
            border: '1px dashed rgba(0,0,0,0.1)',
            bgcolor: '#fafafa'
          }}
        >
          <Avatar sx={{ width: 80, height: 80, bgcolor: theme.palette.grey[200], color: theme.palette.grey[500], mx: 'auto', mb: 3 }}>
            <LuggageIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Typography variant="h5" fontWeight="bold" gutterBottom color="textPrimary">
            No Upcoming Trips
          </Typography>
          <Typography variant="body1" color="textSecondary" mb={4} maxWidth={400} mx="auto">
            You haven't booked any stays with LuxuryStay yet. Experience world-class comfort today.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/book')}
            sx={{ px: 5, py: 1.5, borderRadius: 50 }}
          >
            Find a Suite
          </Button>
        </Paper>
      ) : (
        /* Booking List */
        <Box component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
          <AnimatePresence>
            {bookings.map((b) => {
              const statusColor = getStatusColor(b.status);
              const past = isPast(b.status);

              return (
                <Paper
                  key={b._id}
                  component={motion.div}
                  variants={cardVariants}
                  whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.08)' }}
                  elevation={0}
                  sx={{ 
                    p: 0, 
                    mb: 3, 
                    borderRadius: 3, 
                    overflow: 'hidden',
                    border: '1px solid rgba(0,0,0,0.06)',
                    background: past ? '#fafafa' : 'white',
                    opacity: past ? 0.9 : 1,
                    position: 'relative'
                  }}
                >
                  {/* Color Strip Indicator */}
                  <Box sx={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 6, bgcolor: statusColor }} />

                  <Grid container>
                    {/* Left Section: Room & Status */}
                    <Grid item xs={12} sm={8} sx={{ p: 3, pl: 4 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="start">
                        <Box>
                          <Typography variant="overline" color={past ? 'textSecondary' : 'primary'} fontWeight="bold" letterSpacing={1}>
                            {past ? 'COMPLETED STAY' : 'UPCOMING RESERVATION'}
                          </Typography>
                          <Typography variant="h5" fontWeight="bold" color="textPrimary" sx={{ mt: 0.5 }}>
                             {b.room?.type || 'Luxury'} Suite <Box component="span" sx={{ color: 'text.secondary', fontWeight: 'normal' }}>#{b.roomNumber}</Box>
                          </Typography>
                        </Box>
                        <Chip 
                          label={b.status.replace('_', ' ').toUpperCase()} 
                          size="small"
                          sx={{ 
                            bgcolor: `${statusColor}15`, 
                            color: statusColor, 
                            fontWeight: 'bold',
                            borderRadius: 1
                          }} 
                        />
                      </Box>

                      <Box display="flex" gap={4} mt={3} flexWrap="wrap">
                        {/* Dates */}
                        <Box display="flex" gap={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.grey[100], color: 'text.secondary' }}>
                            <EventIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" display="block" color="textSecondary">Check-in</Typography>
                            <Typography variant="body2" fontWeight="600">{new Date(b.checkInDate).toLocaleDateString()}</Typography>
                          </Box>
                          <ChevronRightIcon color="action" fontSize="small" />
                          <Box>
                            <Typography variant="caption" display="block" color="textSecondary">Check-out</Typography>
                            <Typography variant="body2" fontWeight="600">{new Date(b.checkOutDate).toLocaleDateString()}</Typography>
                          </Box>
                        </Box>

                        {/* Guests */}
                        <Box display="flex" gap={1.5} alignItems="center">
                          <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.grey[100], color: 'text.secondary' }}>
                            <PeopleIcon sx={{ fontSize: 18 }} />
                          </Avatar>
                          <Box>
                            <Typography variant="caption" display="block" color="textSecondary">Guests</Typography>
                            <Typography variant="body2" fontWeight="600">
                              {b.guests.adults} Adt, {b.guests.children} Chd
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>

                    {/* Right Section: Price & Action */}
                    <Grid item xs={12} sm={4} sx={{ 
                      bgcolor: past ? 'transparent' : `${theme.palette.primary.main}08`, 
                      borderLeft: { sm: '1px dashed rgba(0,0,0,0.1)' },
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      alignItems: 'center',
                      textAlign: 'center'
                    }}>
                      <Typography variant="caption" color="textSecondary" fontWeight="bold">TOTAL PAID</Typography>
                      <Typography variant="h4" color="primary" fontWeight="bold" sx={{ my: 1 }}>
                        ${b.totalAmount}
                      </Typography>
                      
                      {!past && (
                        <Button 
                          variant="outlined" 
                          size="small" 
                          startIcon={<ReceiptLongIcon />}
                          sx={{ mt: 1, borderRadius: 2 }}
                        >
                          View Receipt
                        </Button>
                      )}
                      
                      {past && (
                        <Button 
                          variant="text" 
                          color="secondary" 
                          size="small" 
                          onClick={() => navigate('/book')}
                          sx={{ mt: 1 }}
                        >
                          Book Again
                        </Button>
                      )}
                    </Grid>
                  </Grid>
                </Paper>
              );
            })}
          </AnimatePresence>
        </Box>
      )}
    </Container>
  );
};

export default MyBookings;