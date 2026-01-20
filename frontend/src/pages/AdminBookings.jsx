import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Chip, IconButton, Tooltip, 
  CircularProgress, Box, Avatar, useTheme, Card 
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import LogoutIcon from '@mui/icons-material/Logout'; 
import CancelIcon from '@mui/icons-material/Cancel'; 
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RefreshIcon from '@mui/icons-material/Refresh';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  const fetchBookings = async () => {
    try {
      setLoading(true); // Show loader on refresh
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/bookings/all', {
        headers: { 'x-auth-token': token }
      });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const updateStatus = async (id, status) => {
    if (!window.confirm(`Are you sure you want to mark this as ${status}?`)) return;
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status }, {
        headers: { 'x-auth-token': token }
      });
      fetchBookings(); 
    } catch (err) {
      alert('Error updating booking');
    }
  };

  const getStatusConfig = (status) => {
    switch(status) {
      case 'booked': return { color: 'primary', label: 'Confirmed' };
      case 'checked_in': return { color: 'success', label: 'Checked In' };
      case 'checked_out': return { color: 'warning', label: 'Checked Out' }; // Changed to warning (Gold) for history
      case 'cancelled': return { color: 'error', label: 'Cancelled' };
      default: return { color: 'default', label: status };
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 5 }}>
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} component={motion.div} initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}>
        <Box>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ fontFamily: 'Playfair Display', letterSpacing: 1 }}>
            Reservation Management
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Manage guest check-ins, check-outs, and booking requests.
          </Typography>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchBookings} sx={{ bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: '#f5f5f5' } }}>
            <RefreshIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>
      
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress size={60} thickness={4} color="secondary" />
        </Box>
      ) : (
        <Card component={motion.div} initial={{opacity:0, scale: 0.98}} animate={{opacity:1, scale: 1}} elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
          <TableContainer>
            <Table sx={{ minWidth: 700 }}>
              {/* Luxury Header */}
              <TableHead>
                <TableRow sx={{ bgcolor: theme.palette.primary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', py: 2 }}>GUEST DETAILS</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ROOM INFO</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>STAY DURATION</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>OCCUPANCY</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>STATUS</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>ACTIONS</TableCell>
                </TableRow>
              </TableHead>

              <TableBody component={motion.tbody} variants={containerVariants} initial="hidden" animate="visible">
                {bookings.map((b) => {
                  const statusConfig = getStatusConfig(b.status);
                  return (
                    <TableRow 
                      key={b._id} 
                      component={motion.tr} 
                      variants={rowVariants}
                      sx={{ 
                        '&:hover': { bgcolor: '#f9f9f9' }, 
                        transition: 'background-color 0.2s',
                        borderBottom: '1px solid rgba(224, 224, 224, 1)' 
                      }}
                    >
                      {/* Guest Column */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: theme.palette.secondary.light, color: theme.palette.secondary.dark }}>
                            {b.user?.name?.charAt(0).toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight="bold" color="textPrimary">
                              {b.user?.name || 'Unknown Guest'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary" display="block">
                              {b.user?.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Room Column */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <MeetingRoomIcon fontSize="small" color="action" />
                          <Box>
                            <Typography variant="body2" fontWeight="600" color="primary.main">
                              Room {b.roomNumber}
                            </Typography>
                            <Chip 
                              label={b.room?.type || 'Standard'} 
                              size="small" 
                              variant="outlined" 
                              sx={{ 
                                height: 20, 
                                fontSize: '0.65rem', 
                                borderColor: theme.palette.secondary.main, 
                                color: theme.palette.secondary.dark,
                                mt: 0.5 
                              }} 
                            />
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Dates Column */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1} color="text.secondary">
                          <CalendarMonthIcon fontSize="small" />
                          <Typography variant="body2">
                            {new Date(b.checkInDate).toLocaleDateString()} 
                            <Box component="span" sx={{ mx: 1, color: 'text.disabled' }}>→</Box> 
                            {new Date(b.checkOutDate).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Guests Column */}
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <PersonIcon fontSize="small" color="disabled" />
                          <Typography variant="body2">
                            {b.guests.adults} Adults, {b.guests.children} Kids
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell>
                        <Chip 
                          label={statusConfig.label} 
                          color={statusConfig.color}
                          size="small"
                          sx={{ fontWeight: 'bold', minWidth: 80 }}
                        />
                      </TableCell>

                      {/* Actions Column */}
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" gap={1}>
                          {b.status === 'booked' && (
                            <>
                              <Tooltip title="Check In Guest">
                                <IconButton 
                                  size="small" 
                                  onClick={() => updateStatus(b._id, 'checked_in')}
                                  sx={{ 
                                    color: 'success.main', 
                                    bgcolor: 'success.light', 
                                    opacity: 0.8,
                                    '&:hover': { bgcolor: 'success.main', color: 'white' } 
                                  }}
                                >
                                  <CheckCircleIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Cancel Reservation">
                                <IconButton 
                                  size="small" 
                                  onClick={() => updateStatus(b._id, 'cancelled')}
                                  sx={{ 
                                    color: 'error.main', 
                                    bgcolor: 'error.light', 
                                    opacity: 0.8,
                                    '&:hover': { bgcolor: 'error.main', color: 'white' } 
                                  }}
                                >
                                  <CancelIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </>
                          )}
                          
                          {b.status === 'checked_in' && (
                            <Tooltip title="Check Out Guest">
                              <IconButton 
                                size="small" 
                                onClick={() => updateStatus(b._id, 'checked_out')}
                                sx={{ 
                                  color: 'warning.main', 
                                  bgcolor: '#fff3e0',
                                  '&:hover': { bgcolor: 'warning.main', color: 'white' } 
                                }}
                              >
                                <LogoutIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {(b.status === 'checked_out' || b.status === 'cancelled') && (
                            <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                              Archived
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Container>
  );
};

export default AdminBookings;