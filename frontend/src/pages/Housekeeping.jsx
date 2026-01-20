import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, Typography, Grid, Card, CardContent, CardActions, 
  Button, Chip, Box, CircularProgress, Alert, IconButton, Tooltip, useTheme, Paper
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';

const Housekeeping = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/rooms');
      // Filter for rooms that need attention
      setTasks(res.data.filter(r => 
        r.status === 'cleaning' || 
        r.status === 'maintenance' || 
        r.status === 'occupied'
      ));
      setLoading(false);
    } catch (err) {
      setError('Failed to load housekeeping tasks');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:5000/api/rooms/${id}/status`, { status }, {
        headers: { 'x-auth-token': token }
      });
      fetchRooms(); 
    } catch (err) {
      alert('Error updating status');
    }
  };

  // UI Helpers
  const getStatusColor = (status) => {
    if (status === 'cleaning') return theme.palette.warning.main;
    if (status === 'maintenance') return theme.palette.error.main;
    return theme.palette.info.main; // occupied
  };

  const getStatusIcon = (status) => {
    if (status === 'cleaning') return <CleaningServicesIcon fontSize="small" />;
    if (status === 'maintenance') return <BuildIcon fontSize="small" />;
    return <DoNotDisturbOnIcon fontSize="small" />;
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 8 }}>
      
      {/* Header Section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5} component={motion.div} initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}>
        <Box>
          <Typography variant="overline" color="secondary" fontWeight="bold" letterSpacing={1}>
            Service Operations
          </Typography>
          <Typography variant="h4" fontWeight="bold" color="primary" sx={{ fontFamily: 'Playfair Display' }}>
            Housekeeping & Maintenance
          </Typography>
        </Box>
        <Tooltip title="Refresh Tasks">
          <IconButton onClick={fetchRooms} sx={{ bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: '#f5f5f5' } }}>
            <RefreshIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress size={60} thickness={4} color="secondary" />
        </Box>
      ) : (
        <>
          {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
          
          {tasks.length === 0 ? (
            /* Empty State Animation */
            <Box 
              component={motion.div} 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }}
              display="flex" 
              flexDirection="column" 
              alignItems="center" 
              justifyContent="center" 
              py={10}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 6, 
                  borderRadius: '50%', 
                  bgcolor: theme.palette.success.light, 
                  color: theme.palette.success.dark,
                  mb: 3
                }}
              >
                <CheckCircleOutlineIcon sx={{ fontSize: 80 }} />
              </Paper>
              <Typography variant="h5" fontWeight="bold" color="textPrimary">
                All Rooms Pristine
              </Typography>
              <Typography variant="body1" color="textSecondary">
                There are no active cleaning or maintenance tasks.
              </Typography>
            </Box>
          ) : (
            /* Task Grid */
            <Grid container spacing={3} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
              <AnimatePresence>
                {tasks.map((room) => {
                  const statusColor = getStatusColor(room.status);
                  const StatusIcon = getStatusIcon(room.status);

                  return (
                    <Grid item xs={12} md={6} lg={4} key={room._id} component={motion.div} variants={cardVariants} layout>
                      <Card 
                        component={motion.div}
                        whileHover={{ y: -5 }}
                        sx={{ 
                          borderTop: `6px solid ${statusColor}`,
                          borderRadius: 3,
                          boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                          overflow: 'visible'
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          {/* Card Header */}
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box>
                              <Typography variant="h4" fontWeight="bold" color="textPrimary">
                                {room.roomNumber}
                              </Typography>
                              <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                {room.type} Suite
                              </Typography>
                            </Box>
                            <Chip 
                              icon={StatusIcon}
                              label={room.status.toUpperCase()} 
                              sx={{ 
                                bgcolor: `${statusColor}20`, // 20% opacity hex
                                color: statusColor,
                                fontWeight: 'bold',
                                border: `1px solid ${statusColor}`
                              }} 
                            />
                          </Box>

                          {/* Context Message */}
                          <Box 
                            sx={{ 
                              p: 2, 
                              borderRadius: 2, 
                              bgcolor: '#f5f5f5', 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 1.5 
                            }}
                          >
                            {room.status === 'cleaning' && <RoomServiceIcon color="warning" />}
                            {room.status === 'maintenance' && <WarningAmberIcon color="error" />}
                            {room.status === 'occupied' && <DoNotDisturbOnIcon color="info" />}
                            
                            <Typography variant="body2" fontWeight="500">
                              {room.status === 'cleaning' && "Requires turnover service."}
                              {room.status === 'maintenance' && "Requires technical attention."}
                              {room.status === 'occupied' && "Guest currently in residence."}
                            </Typography>
                          </Box>
                        </CardContent>

                        {/* Actions */}
                        <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                          <Button 
                            variant="contained" 
                            color="success"
                            startIcon={<CheckCircleOutlineIcon />}
                            onClick={() => updateStatus(room._id, 'available')}
                            sx={{ borderRadius: 2, flex: 1, mr: 1, boxShadow: 'none' }}
                            disabled={room.status === 'occupied'} // Can't clean occupied room
                          >
                            Mark Ready
                          </Button>
                          
                          {room.status !== 'maintenance' && (
                             <Button 
                              variant="outlined" 
                              color="error"
                              startIcon={<BuildIcon />}
                              onClick={() => updateStatus(room._id, 'maintenance')}
                              sx={{ borderRadius: 2, flex: 1, border: '2px solid' }}
                            >
                              Report Issue
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </AnimatePresence>
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default Housekeeping;