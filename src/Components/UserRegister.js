import React, { useState, useRef } from 'react';
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Link,
  Paper,
} from '@mui/material';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null,
  });

  const fileInputRef = useRef(null); // Create a ref for the file input

  const handleChange = (e) => {
    if (e.target.name === 'profilePhoto') {
      setFormData({ ...formData, profilePhoto: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('password', formData.password);
    data.append('profilePhoto', formData.profilePhoto);

    try {
      const res = await axios.post('http://localhost:5000/api/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(res.data.message);
      navigate('/userlogin');
    } catch (err) {
      console.error(err);
      alert('Registration failed');
    }
  };

  const inputDesign = {
    '& .MuiOutlinedInput-root': {
      fontSize: { xs: '0.85rem', sm: '1rem' },
      '& input': {
        padding: { xs: '8px 10px', sm: '12px 14px' },
      },
      '& fieldset': {
        borderColor: '#24c6ef',
        borderRadius: '10px',
      },
      '&:hover fieldset': {
        borderColor: '#00c6fb',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#00c6fb',
        boxShadow: '0 0 5px #00c6fb',
      },
    },
    '& label': {
      fontSize: { xs: '0.85rem', sm: '1rem' },
    },
    '& label.Mui-focused': {
      color: '#00c6fb',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#cdebf3ff',
        display: 'flex',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'center',
        p: { md: 2, xs: 0 },
      }}
    >
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        maxWidth="lg"
      >
        <Grid item xs={12} md={6}>
          <Paper
            elevation={6}
            sx={{
              background: 'linear-gradient(to bottom right, #24c6ef, #a8edea)',
              p: { xs: 3 },
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: { xs: 'auto', md: '577px' },
              width: { xs: 310, md: 450 },
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                backgroundColor: '#1b2a41',
                clipPath:
                  'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <img
                src="/Images/logo2.png"
                alt="logo2"
                style={{
                  maxWidth: '80%',
                  height: 'auto',
                }}
              />
            </Box>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="#1b2a41"
              gutterBottom
              align="center"
              sx={{ fontSize: { xs: '1.3rem', md: '1.75rem' } }}
            >
              Get Closer to Your Goals
            </Typography>
            <Typography
              variant="subtitle1"
              color="#1b2a41"
              align="center"
              sx={{ fontSize: { xs: '0.9rem', md: '1rem' } }}
            >
              Register Now.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={4}
            sx={{
              backgroundColor: '#e6fbf9',
              p: { md: 4, xs: 2 },
              maxWidth: { md: 450 },
              height: { md: '77vh' },
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: '#1b2a41', mb: { md: 3, xs: 0 }, textAlign: 'center' }}
            >
              REGISTER
            </Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formData.name}
                required
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#1b2a41' } }}
                sx={inputDesign}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Email address"
                name="email"
                type="email"
                value={formData.email}
                required
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#1b2a41' } }}
                sx={inputDesign}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                required
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#1b2a41' } }}
                sx={inputDesign}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                required
                onChange={handleChange}
                InputLabelProps={{ style: { color: '#1b2a41' } }}
                sx={inputDesign}
              />

              {/* Custom file upload button */}
              <Box sx={{ mt: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => fileInputRef.current.click()}
                                sx={{   borderColor: '#24c6ef',
        borderRadius: '10px',py:{md:1,xs:0.5}}}

                >
                  Upload Your Photo
                </Button>
                <input
                  type="file"
                  name="profilePhoto"
                  onChange={handleChange}
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                />
                {formData.profilePhoto && (
                  <Typography variant="body2" sx={{ mt: 1, color: '#1b2a41' }}>
                    Selected file: {formData.profilePhoto.name}
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: { md: 3, xs: 1.5 },
                  backgroundColor: '#24c6ef',
                  '&:hover': { backgroundColor: '#1cb5e0' },
                  fontWeight: 'bold',
                  py: { md: 1.5, xs: 1 },
                  fontSize: { md: '1rem', xs: '0.85rem' },
                }}
              >
                CREATE ACCOUNT
              </Button>

              <Typography variant="body2" align="center" sx={{ mt: { md: 3, xs: 0 } }}>
                Already have an account?{' '}
                <Link component={RouterLink} to="/userlogin" underline="hover">
                  Login here
                </Link>
              </Typography>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterPage;


