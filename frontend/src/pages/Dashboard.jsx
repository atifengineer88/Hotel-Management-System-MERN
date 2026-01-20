import { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, Grid, Card, CardContent, Typography, Chip, Box, 
  CircularProgress, IconButton, Tooltip, useTheme, Paper 
} from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

const Dashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, available: 0, occupied: 0, cleaning: 0 });
  const theme = useTheme();

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/rooms');
      setRooms(res.data);
      calculateStats(res.data);
    } catch (err) {
      console.error("Error fetching rooms");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    setStats({
      total: data.length,
      available: data.filter(r => r.status === 'available').length,
      occupied: data.filter(r => r.status === 'occupied').length,
      cleaning: data.filter(r => r.status === 'cleaning' || r.status === 'maintenance').length,
    });
  };

  useEffect(() => { fetchRooms(); }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return theme.palette.success.main;
      case 'occupied': return theme.palette.error.main;
      case 'cleaning': return theme.palette.warning.main;
      case 'maintenance': return theme.palette.warning.dark;
      default: return theme.palette.grey[500];
    }
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // Sub-component for Stat Cards
  const StatWidget = ({ title, value, icon, color }) => (
    <Paper 
      component={motion.div}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      elevation={0}
      sx={{ 
        p: 3, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderRadius: 3,
        background: `linear-gradient(135deg, ${color} 0%, ${theme.palette.background.paper} 100%)`,
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
      }}
    >
      <Box>
        <Typography variant="body2" color="textSecondary" fontWeight="bold" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
          {title}
        </Typography>
        <Typography variant="h4" fontWeight="bold" color="textPrimary">
          {value}
        </Typography>
      </Box>
      <Box sx={{ 
        p: 1.5, 
        borderRadius: '50%', 
        bgcolor: 'rgba(255,255,255,0.5)', 
        color: 'text.primary',
        display: 'flex'
      }}>
        {icon}
      </Box>
    </Paper>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 8 }}>
      
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={5} component={motion.div} initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}>
        <Box>
          <Typography variant="overline" color="secondary" fontWeight="bold">Real-Time Overview</Typography>
          <Typography variant="h3" fontWeight="bold" color="primary" sx={{ fontFamily: 'Playfair Display' }}>
            Hotel Dashboard
          </Typography>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={fetchRooms} sx={{ bgcolor: 'white', boxShadow: 2, '&:hover': { bgcolor: '#f5f5f5' } }}>
            <RefreshIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Stats Section */}
      <Grid container spacing={3} mb={6}>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Total Suites" value={stats.total} color="#e3f2fd" icon={<MeetingRoomIcon />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Available" value={stats.available} color="#e8f5e9" icon={<CheckCircleOutlineIcon color="success" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Occupied" value={stats.occupied} color="#ffebee" icon={<DoNotDisturbOnIcon color="error" />} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatWidget title="Service" value={stats.cleaning} color="#fff3e0" icon={<CleaningServicesIcon color="warning" />} />
        </Grid>
      </Grid>

      {/* Rooms Grid */}
      <Box mb={2}>
        <Typography variant="h5" fontWeight="bold" color="textPrimary" sx={{ mb: 3 }}>
          Live Room Status
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={10}>
          <CircularProgress size={60} thickness={4} color="secondary" />
        </Box>
      ) : (
        <Grid container spacing={3} component={motion.div} variants={containerVariants} initial="hidden" animate="visible">
          {rooms.map((room) => {
            const statusColor = getStatusColor(room.status);
            return (
              <Grid item xs={12} sm={6} md={3} key={room._id} component={motion.div} variants={cardVariants}>
                <Card 
                  component={motion.div}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  sx={{ 
                    position: 'relative',
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }}
                >
                  {/* Status Color Bar */}
                  <Box sx={{ height: 6, bgcolor: statusColor, width: '100%' }} />
                  
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box>
                        <Typography variant="h4" fontWeight="bold" color="textPrimary">
                          {room.roomNumber}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                          {room.type} Suite
                        </Typography>
                      </Box>
                      {/* Price Tag */}
                      <Chip 
                        icon={<AttachMoneyIcon sx={{ fontSize: '1rem !important' }} />} 
                        label={room.price} 
                        size="small"
                        sx={{ bgcolor: 'rgba(0,0,0,0.05)', fontWeight: 'bold' }}
                      />
                    </Box>

                    <Box mt={3} display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ 
                          width: 8, height: 8, borderRadius: '50%', 
                          bgcolor: statusColor,
                          boxShadow: `0 0 8px ${statusColor}`
                        }} />
                        <Typography variant="caption" fontWeight="bold" sx={{ textTransform: 'uppercase', color: statusColor }}>
                          {room.status}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default Dashboard;