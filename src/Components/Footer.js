import React from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import '@fontsource/orbitron'; // Automatically fetches from Google Fonts


const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#24c6efff', color: 'white', p: 2,width:{md:"100%"}, }}>
      <Grid container spacing={4} justifyContent="space-between" alignItems="center">

 {/* Left Column - Contact Info */}
       <Grid item xs={12} md={8}>
  <Box
    display="flex"
    flexWrap="nowrap" // ✅ No wrapping
    alignItems="center"
    gap={{ md: 60, xs: 1 }}
    sx={{
      overflow: 'hidden', // ✅ Prevent breaking
      minWidth: 0,
    }}
  >
    <Typography sx={{ fontSize: { md: 16, xs: 12 }, whiteSpace: 'nowrap' }}>
      <PhoneIcon sx={{ fontSize: { md: 16, xs: 12}, mr: 1 }} /> +91 94860 42369
    </Typography>

    <Typography
      sx={{
        fontSize: { md: '32px', xs: '14px' },
        fontWeight: 700,
        fontFamily: 'Orbitron, sans-serif',
        letterSpacing: '2px',
        ml: { md: 'auto', xs: 1 }, // ✅ Auto push to right
        whiteSpace: 'nowrap',
      }}
    >
      <Box component="span" sx={{ color: '#ffffff' }}>finan</Box>
      <Box component="span" sx={{ color: '#fecdc1' }}>cio</Box>
    </Typography>

    <Typography
      sx={{
        ml: { md: 3, xs: 1 },
        fontSize: { md: 16, xs: 12 },
        whiteSpace: 'nowrap',
      }}
    >
      <PhoneIcon sx={{ fontSize: { md: 16, xs: 12 }, mr: 1 }} /> +91 81480 42369
    </Typography>
  </Box>
</Grid>


        {/* Right Column - Social Icons */}
      
      </Grid>

      {/* Bottom Copyright */}
      <Box textAlign="center"  borderTop="1px solid rgba(255,255,255,0.2)">
         <Grid item xs={12} md={4}>
         
        </Grid>
      <Grid
  sx={{
    display: "flex",
    flexDirection: { xs: "column", md: "row" }, // mobile la column, desktop la row
    alignItems: "center",
    ml: { md: "500px", xs: 2 },
    gap: 1,
    textAlign: { xs: "center", md: "left" }
  }}
>
  <Typography
    variant="body2"
    sx={{
      mt: 2,
      color: "white",
      fontSize: { xs: "10px", sm: "12px", md: "14px" },
      whiteSpace: "nowrap",
    }}
  >
    © <strong>LifeChangersInd</strong>. All Rights Reserved.
  </Typography>

  <Box display="flex" gap={1} >
    <a
      href="https://x.com/Lifechangersind?t=Yc8WfiFeA611U-8oLd15sg&s=09"
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconButton color="inherit"><TwitterIcon sx={{ color: "white" }} /></IconButton>
    </a>

    <a
      href="https://www.facebook.com/lc.ind.50?mibextid=LQQJ4d"
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconButton color="inherit"><FacebookIcon sx={{ color: "white" }} /></IconButton>
    </a>

    <a
      href="https://www.linkedin.com/in/life-changers-ind-5696b720a/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconButton color="inherit"><LinkedInIcon sx={{ color: "white" }} /></IconButton>
    </a>

    <a
      href="https://www.instagram.com/lifechangersind/?igsh=dnY1MGo0OXQzd2tj#"
      target="_blank"
      rel="noopener noreferrer"
    >
      <IconButton color="inherit"><InstagramIcon sx={{ color: "white" }} /></IconButton>
    </a>

    <a href="mailto:lifechangersind@gmail.com">
      <IconButton color="inherit"><EmailIcon sx={{ color: "white" }} /></IconButton>
    </a>
  </Box>
</Grid>

      </Box>
    </Box>
  );
};

export default Footer;

