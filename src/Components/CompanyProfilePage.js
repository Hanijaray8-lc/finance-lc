import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Box,
  Avatar,
  Paper,
  Divider
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  Language as LanguageIcon,
  Business as BusinessIcon,
  LocationOn as LocationOnIcon,
  Description as DescriptionIcon,
  Info as InfoIcon,
  Badge as BadgeIcon,
  Person as PersonIcon,
} from '@mui/icons-material';


const CompanyProfilePage = () => {
  const [company, setCompany] = useState(null);
  const companyId = localStorage.getItem('companyId');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/financeCompanies/profile/${companyId}`);
        setCompany(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, [companyId]);

 

  return (
    <Box sx={{ backgroundColor: '#cdebf3ff', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="md">
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', backgroundColor: '#e6fbf9' }}>
          {/* Header */}
          <Box sx={{ backgroundColor: '#24c6ef', color: 'white', py: 3, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              Company Profile
            </Typography>
          </Box>

          {/* Avatar */}
          {company?.logo && (
            <Box display="flex" justifyContent="center" mt={-5}>
              <Avatar
                src={
                  company.logo.startsWith('http')
                    ? company.logo
                    : `http://localhost:5000/uploads/${company.logo}`
                }
                alt="Company Logo"
                sx={{ width: 100, height: 100, border: '4px solid white' }}
              />
            </Box>
          )}
        <Typography
  variant="h6"
  sx={{ textDecoration: 'underline', color: '#24c6ef', mt: 1, mb: 1, textAlign:"center" }}
>
  {company?.name}
</Typography>



          {/* Details */}
          {company ? (
          <Box p={3}>
  <Grid container direction="column" spacing={2}>
    <Grid item>
      <Typography>
        <PersonIcon sx={{ verticalAlign: 'middle', mr: 1,color:'#24c6ef' }} />
        <strong style={{color:'#24c6ef'}}>First Name:</strong> {company.firstName}
      </Typography>
    </Grid>
    <Divider />

    <Grid item>
      <Typography>
        <BusinessIcon sx={{ verticalAlign: 'middle', mr: 1,color:'#24c6ef' }} />
        <strong style={{color:'#24c6ef'}}>Company Name:</strong> {company.name}
      </Typography>
    </Grid>
    <Divider />

    <Grid item>
      <Typography>
        <BadgeIcon sx={{ verticalAlign: 'middle', mr: 1,color:'#24c6ef' }} />
        <strong style={{color:'#24c6ef'}}>Company ID:</strong> {company.companyId}
      </Typography>
    </Grid>
    <Divider />

    <Grid item>
      <Typography>
        <EmailIcon sx={{ verticalAlign: 'middle', mr: 1 ,color:'#24c6ef'}} />
        <strong style={{color:'#24c6ef'}}>Email:</strong> {company.email}
      </Typography>
    </Grid>
    <Divider />

    <Grid item>
      <Typography>
        <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1 ,color:'#24c6ef'}} />
        <strong style={{color:'#24c6ef'}}>Contact:</strong> {company.contactNumber}
      </Typography>
    </Grid>
    <Divider />

    <Grid item>
      <Typography>
        <LanguageIcon sx={{ verticalAlign: 'middle', mr: 1,color:'#24c6ef' }} />
        <strong style={{color:'#24c6ef'}}>Website:</strong> {company.website}
      </Typography>
    </Grid>
    <Divider />

    <Grid item>
      <Typography>
        <LocationOnIcon sx={{ verticalAlign: 'middle', mr: 1,color:'#24c6ef' }} />
        <strong style={{color:'#24c6ef'}}>Branch:</strong> {company.branch}
      </Typography>
    </Grid>
    <Divider />

    <Grid item>
      <Typography>
        <DescriptionIcon sx={{ verticalAlign: 'middle', mr: 1,color:'#24c6ef' }} />
        <strong style={{color:'#24c6ef'}}>Description:</strong> {company.description}
      </Typography>
    </Grid>
    <Divider />

    <Grid item>
      <Typography>
        <InfoIcon sx={{ verticalAlign: 'middle', mr: 1 ,color:'#24c6ef'}} />
        <strong style={{color:'#24c6ef'}}>Details:</strong> {company.details}
      </Typography>
    </Grid>
  </Grid>
</Box>

          ) : (
            <Box p={3}>
              <Typography>Loading...</Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CompanyProfilePage;

