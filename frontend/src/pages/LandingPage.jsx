import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, Box, Typography, Button, Grid, Card, CardContent, 
  useTheme, Avatar, Stack, IconButton, TextField, InputAdornment 
} from '@mui/material';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Icons
import StarIcon from '@mui/icons-material/Star';
import PoolIcon from '@mui/icons-material/Pool';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import WifiIcon from '@mui/icons-material/Wifi';
import KingBedIcon from '@mui/icons-material/KingBed';
import SpaIcon from '@mui/icons-material/Spa';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import CircleIcon from '@mui/icons-material/Circle';

const LandingPage = () => {
  const theme = useTheme();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]); // Parallax effect

  // --- CAROUSEL CONFIGURATION ---
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "LUXURY STAY",
      subtitle: "Where Elegance Meets Comfort. Your Perfect Escape."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1571896349842-6e53ce41e86c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "SERENITY SPA",
      subtitle: "Rejuvenate Your Senses in Our World-Class Wellness Center."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      title: "EXQUISITE DINING",
      subtitle: "Experience Culinary Masterpieces by Michelin Chefs."
    }
  ];

  // Auto-play Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const features = [
    { icon: <KingBedIcon fontSize="large" />, title: 'Royal Suites', desc: 'Hand-crafted furniture and Egyptian cotton linens for your ultimate comfort.' },
    { icon: <RestaurantIcon fontSize="large" />, title: 'Michelin Dining', desc: 'Culinary masterpieces prepared by world-renowned chefs.' },
    { icon: <SpaIcon fontSize="large" />, title: 'Serenity Spa', desc: 'Rejuvenate your senses with our award-winning wellness treatments.' },
    { icon: <PoolIcon fontSize="large" />, title: 'Skyline Pool', desc: 'Infinity pool offering panoramic views of the city sunset.' },
  ];

  const testimonials = [
    { name: "Sarah Jenkins", role: "Vogue Editor", text: "An absolute masterpiece of hospitality. The attention to detail is unmatched.", img: "https://i.pravatar.cc/150?u=1" },
    { name: "Michael Chen", role: "CEO, TechFlow", text: "The perfect blend of business and leisure. The high-speed fiber network is a lifesaver.", img: "https://i.pravatar.cc/150?u=2" },
    { name: "Elena Rodriguez", role: "Travel Blogger", text: "I have stayed in hotels all over the world, but LuxuryStay stole my heart.", img: "https://i.pravatar.cc/150?u=3" }
  ];

  return (
    <Box sx={{ overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION (With Carousel) */}
      <Box sx={{ height: '100vh', position: 'relative', overflow: 'hidden', bgcolor: 'black' }}>
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              top: 0, left: 0, width: '100%', height: '100%',
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url("${slides[currentSlide].image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        </AnimatePresence>

        {/* Hero Content */}
        <Container 
          component={motion.div} 
          style={{ y: y1 }}
          sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 2 }}
        >
          <Box textAlign="center" color="white">
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="overline" sx={{ letterSpacing: 4, fontSize: '1.2rem', color: theme.palette.secondary.light }}>
                  Welcome to Excellence
                </Typography>
                <Typography variant="h1" sx={{ mb: 2, fontFamily: 'Playfair Display', fontWeight: 700, fontSize: { xs: '3rem', md: '6rem' } }}>
                  {slides[currentSlide].title}
                </Typography>
                <Typography variant="h5" sx={{ mb: 6, fontWeight: 300, maxWidth: '800px', mx: 'auto', opacity: 0.9 }}>
                  {slides[currentSlide].subtitle}
                </Typography>
              </motion.div>
            </AnimatePresence>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                component={Link} 
                to="/login"
                sx={{ px: 5, py: 2, fontSize: '1.1rem', borderRadius: 0 }}
              >
                Book Your Stay
              </Button>
              <Button 
                variant="outlined" 
                color="inherit" 
                size="large" 
                component={Link} 
                to="/register" 
                sx={{ px: 5, py: 2, fontSize: '1.1rem', borderWidth: 2, borderRadius: 0, '&:hover': { borderWidth: 2 } }}
              >
                Become a Member
              </Button>
            </Stack>
          </Box>
        </Container>
        
        {/* Carousel Indicators (Dots) */}
        <Box sx={{ position: 'absolute', bottom: 100, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 2, zIndex: 10 }}>
          {slides.map((_, index) => (
            <IconButton 
              key={index} 
              onClick={() => setCurrentSlide(index)}
              size="small"
              sx={{ color: currentSlide === index ? theme.palette.secondary.main : 'rgba(255,255,255,0.5)' }}
            >
              <CircleIcon fontSize="inherit" sx={{ fontSize: currentSlide === index ? 16 : 10 }} />
            </IconButton>
          ))}
        </Box>

        {/* Scroll Down Indicator */}
        <Box 
          component={motion.div} 
          animate={{ y: [0, 10, 0] }} 
          transition={{ repeat: Infinity, duration: 2 }}
          sx={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', opacity: 0.7, color: 'white' }}
        >
          <Typography variant="caption" sx={{ letterSpacing: 2 }}>SCROLL DOWN</Typography>
        </Box>
      </Box>

      {/* 2. INTRO / ABOUT SECTION */}
      <Container sx={{ py: 15 }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <Box sx={{ position: 'relative' }}>
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3" 
                  alt="Hotel Interior" 
                  style={{ width: '100%', borderRadius: '4px', boxShadow: '0 30px 60px rgba(0,0,0,0.3)' }} 
                />
                <Box sx={{ 
                  position: 'absolute', bottom: -30, right: -30, 
                  bgcolor: 'secondary.main', color: 'white', p: 4, 
                  boxShadow: 4, display: { xs: 'none', md: 'block' } 
                }}>
                  <Typography variant="h3" fontWeight="bold" fontFamily="Playfair Display">500+</Typography>
                  <Typography variant="subtitle2">Luxury Rooms</Typography>
                </Box>
              </Box>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <Typography variant="overline" color="secondary" fontWeight="bold" letterSpacing={2}>Our Story</Typography>
              <Typography variant="h2" sx={{ mb: 3, fontFamily: 'Playfair Display', color: 'primary.main' }}>
                Redefining Hospitality Since 1998
              </Typography>
              <Typography color="textSecondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                At LuxuryStay, we believe in more than just a place to sleep. We offer an experience. From our concierge services to our spa treatments, every detail is curated for your pleasure.
              </Typography>
              <Typography color="textSecondary" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                Whether you are here for business or leisure, our dedicated team is committed to exceeding your expectations at every turn.
              </Typography>
              <Button variant="text" color="primary" size="large" endIcon={<ArrowForwardIcon />} sx={{ mt: 2, fontSize: '1.1rem' }}>
                Discover Our Heritage
              </Button>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* 3. AMENITIES SECTION */}
      <Box sx={{ bgcolor: '#0a0f2c', color: 'white', py: 15, position: 'relative', overflow: 'hidden' }}>
        {/* Background Pattern */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.05, 
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Box textAlign="center" mb={10}>
            <Typography variant="overline" color="secondary" letterSpacing={3}>Unmatched Services</Typography>
            <Typography variant="h2" fontFamily="Playfair Display" mt={2}>World Class Amenities</Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }} 
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  whileHover={{ y: -10 }}
                >
                  <Card sx={{ 
                    bgcolor: 'rgba(255,255,255,0.03)', 
                    color: 'white', 
                    backdropFilter: 'blur(10px)', 
                    height: '100%',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 0
                  }}>
                    <CardContent sx={{ textAlign: 'center', py: 6, px: 3 }}>
                      <Box sx={{ color: theme.palette.secondary.main, mb: 3 }}>{feature.icon}</Box>
                      <Typography variant="h5" fontFamily="Playfair Display" gutterBottom>{feature.title}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.7, lineHeight: 1.6 }}>{feature.desc}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 4. TESTIMONIALS */}
      <Container sx={{ py: 15 }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="overline" color="secondary" letterSpacing={2}>Testimonials</Typography>
          <Typography variant="h2" fontFamily="Playfair Display" color="primary.main">Guest Experiences</Typography>
        </Box>
        <Grid container spacing={4}>
          {testimonials.map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                viewport={{ once: true }} 
                transition={{ delay: index * 0.2 }}
              >
                <Card sx={{ height: '100%', borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box display="flex" justifyContent="center" mb={2}>
                      {[1,2,3,4,5].map(s => <StarIcon key={s} sx={{ color: '#FFD700', fontSize: 20 }} />)}
                    </Box>
                    <Typography paragraph sx={{ fontStyle: 'italic', fontSize: '1.1rem', color: '#555' }}>
                      "{item.text}"
                    </Typography>
                    <Box display="flex" alignItems="center" justifyContent="center" mt={3} gap={2}>
                      <Avatar src={item.img} sx={{ width: 50, height: 50 }} />
                      <Box textAlign="left">
                        <Typography variant="subtitle1" fontWeight="bold">{item.name}</Typography>
                        <Typography variant="caption" color="textSecondary">{item.role}</Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 5. CTA SECTION */}
      <Box sx={{ bgcolor: theme.palette.secondary.main, color: 'white', py: 10 }}>
        <Container>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h3" fontFamily="Playfair Display" fontWeight="bold">
                Ready for an unforgettable stay?
              </Typography>
              <Typography variant="h6" sx={{ mt: 1, fontWeight: 300 }}>
                Join 10,000+ happy guests. Book your luxury suite today.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
              <Button 
                variant="contained" 
                size="large" 
                component={Link} to="/register"
                sx={{ 
                  bgcolor: 'white', color: 'secondary.main', 
                  px: 6, py: 2, fontSize: '1.1rem', fontWeight: 'bold',
                  '&:hover': { bgcolor: '#f5f5f5' }
                }}
              >
                Get Started
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 6. FOOTER (UPDATED to Blue) */}
      <Box sx={{ bgcolor: theme.palette.primary.main, color: 'white', py: 8 }}>
        <Container>
          <Grid container spacing={8}>
            <Grid item xs={12} md={4}>
              <Typography variant="h4" color="white" fontFamily="Playfair Display" mb={2}>LuxuryStay</Typography>
              <Typography variant="body2" paragraph sx={{ opacity: 0.8 }}>
                Experience the pinnacle of luxury in our award-winning hotels. 
                We are dedicated to providing an exceptional experience for every guest.
              </Typography>
              <Stack direction="row" spacing={2} mt={2}>
                <IconButton sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}><InstagramIcon /></IconButton>
                <IconButton sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}><FacebookIcon /></IconButton>
                <IconButton sx={{ color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}><TwitterIcon /></IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" color="white" mb={3}>Quick Links</Typography>
              <Stack spacing={1}>
                <Link to="/" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>Home</Link>
                <Link to="/login" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>Login</Link>
                <Link to="/register" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>Register</Link>
                <Link to="#" style={{ color: 'inherit', textDecoration: 'none', opacity: 0.8 }}>About Us</Link>
              </Stack>
            </Grid>
            <Grid item xs={12} md={2}>
              <Typography variant="h6" color="white" mb={3}>Contact</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>123 Luxury Ave,</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>Beverly Hills, CA 90210</Typography>
              <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>+1 (555) 123-4567</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>concierge@luxurystay.com</Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" color="white" mb={3}>Newsletter</Typography>
              <Typography variant="body2" mb={2} sx={{ opacity: 0.8 }}>Subscribe to receive exclusive offers.</Typography>
              <TextField 
                variant="outlined" 
                placeholder="Your email address" 
                size="small"
                fullWidth
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  borderRadius: 1, 
                  input: { color: 'white' },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton sx={{ color: 'secondary.main' }}>
                        <EmailIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>
          <Box borderTop="1px solid rgba(255,255,255,0.1)" mt={8} pt={4} textAlign="center">
            <Typography variant="body2" sx={{ opacity: 0.6 }}>© 2026 LuxuryStay Hospitality. All rights reserved.</Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;