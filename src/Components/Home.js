import React, { useRef } from 'react';
import { Box, Container, Grid, Typography, Button, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import Navbar from '../Components/Navbar';
import EmiCalculator from './EmiCalculator';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const handleClick = () => {
    navigate('/AllFinanci');
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const loans = [
    { img: '/Images/homeloan.png', alt: 'Home Loan', title: 'Home Loan', desc: 'Get the best rates for your dream home with easy EMI options.' },
    { img: '/Images/BusinessLoan1.jpg', alt: 'Business Loan', title: 'Business Loan', desc: 'Empower your business with our flexible loan solutions.' },
    { img: '/Images/educationloan.png', alt: 'Education Loan', title: 'Education Loan', desc: 'Support your higher studies with our low-interest education loans.' },
    { img: '/Images/personalloan.jpg', alt: 'Personal Loan', title: 'Personal Loan', desc: 'Quick and hassle-free personal loans for your needs.' },
    { img: '/Images/carloan.png', alt: 'Car Loan', title: 'Car Loan', desc: 'Drive your dream car with easy and affordable car loans.' },
    { img: '/Images/goldloan1.jpg', alt: 'Gold Loan', title: 'Gold Loan', desc: 'Get instant cash against your gold with minimal paperwork.' },
  ];

  return (
    <>
      <Navbar />
      <Box sx={{ fontFamily: 'Arial, sans-serif',height:{xs:'250vh',md:'200vh'} }}>

        {/* Hero Section */}
        <Box
          sx={{
            backgroundColor: '#f4f4f4',
            py: { xs: 4, sm: 2, md: 8 },
            px: 2,
            textAlign: 'center',
            backgroundImage: 'url(/Images/hero.png)',
            backgroundSize: '100% 100%',
            backgroundRepeat: 'no-repeat',
            color: '#fff',
          }}
        >
          <Container maxWidth="md">
            <Typography sx={{
              fontWeight: 'bold',
              mb: 2,
              color: '#de32a8ff',
              fontSize: { xs: 24, sm: 32, md: 40 },
              fontFamily: 'Poppins, sans-serif',
            }}>
              Empowering your financial growth with{' '}
              <span style={{ color: '#de32a8ff' }}>expert solutions</span>
            </Typography>
            <Typography variant="body1" sx={{
              mb: 4,
              color: '#24c6efff',
              fontWeight: 'bold',
              fontSize: { xs: 14, sm: 16, md: 18 },
              fontFamily: 'Poppins, sans-serif',
            }}>
              We provide innovative financial services and strategic consulting to help your business achieve stability, growth,
              and long-term success in a competitive market.
            </Typography>

            <Button
              variant="contained"
              onClick={handleClick}
              sx={{
                backgroundColor: '#24c6efff',
                px: 4,
                py: 1,
                fontSize: { xs: '0.8rem', md: '1rem' },
                fontFamily: 'Poppins, sans-serif',
                '&:hover': { backgroundColor: '#3f5ad8' },
              }}
            >
              Let's start now
            </Button>
          </Container>
        </Box>

        {/* Loan Services + EMI Calculator */}
        <Box
          sx={{
            backgroundImage: 'linear-gradient(to bottom right, #cdebf3ff, #aae3f0ff)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            pl: { xs: 0, md: 4 },pb:1
          }}
        >
          {/* Loan Services */}
          <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: '60%' } }}>
            <Box sx={{ display: { xs: 'flex', }, justifyContent: 'space-between', mb: 1, px: 2 }}>
             <IconButton onClick={() => handleScroll('left')}  sx={{ display:{md: 'none'}}}>
                <ArrowBackIos />
              </IconButton>
          <Typography
  variant="h4"
  sx={{
    mb: 4,
    mt: 4,
    textAlign: 'center',
    color:'#24c6efff',
    fontWeight:"bold",
    fontSize: { xs: '1.5rem', md: '2.125rem' } // xs=mobile, md=desktop
  }}
>
  Our Loan Services
</Typography>

              <IconButton onClick={() => handleScroll('right')} sx={{ display:{md: 'none'}}}>
                <ArrowForwardIos />
              </IconButton></Box>


            {/* Loan Cards */}
            <Grid
              ref={scrollRef}
              container
             spacing={{ xs: 0, md: 2 }}
              sx={{
                flexWrap: { xs: 'nowrap', md: 'wrap' },
                overflowX: { xs: 'auto', md: 'visible' },
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {loans.map((loan, index) => (
                <Grid
                  item
                  xs={8}
                  sm={6}
                  md={6}
                  key={index}
                  display="flex"
                  justifyContent="center"
                  sx={{ flex: { xs: '0 0 auto', md: 'initial' } }}
                >
                <Box
  sx={{
    p: 2,
    backgroundColor: '#e6fbf9',
    borderRadius: 2,
    display: 'flex',
    flexDirection: 'column',
    width: { xs: '200px', md: '230px' },
    ml: { xs: 2 },
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.15)',
    },
  }}
>

                    <Box
                      sx={{
                        width: '100%',
                        height: '150px',
                        overflow: 'hidden',
                        borderRadius: '8px',
                        mb: 2,
                      }}
                    >
                      <img
                        src={loan.img}
                        alt={loan.alt}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, color: '#24c6efff', textAlign: 'center' }}>
                      {loan.title}
                    </Typography>
                    <Typography sx={{ flexGrow: 1, textAlign: 'center' }}>{loan.desc}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* EMI Calculator */}
          <Grid item xs={12} md={6} sx={{ width: { xs: '100%', md: '40%' },  }}>
            <EmiCalculator />
          </Grid>
        </Box>

        <Footer />
      </Box>
    </>
  );
}

export default HomePage;

