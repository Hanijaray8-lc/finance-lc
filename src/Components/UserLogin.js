import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Modal, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  
  // For forgot password modal
  const [openForgotPassword, setOpenForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  {/*const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        identifier: formData.identifier,
        password: formData.password,
      });

      const user = res.data.user;
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('username', user.username);
      localStorage.setItem('profilePhoto', user.profilePhoto || '');

      alert(res.data.message || "Login successful");
      navigate('/Home'); 
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };*/}

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/login', {
      identifier: formData.identifier,
      password: formData.password,
    });

    const user = res.data.user;
    localStorage.setItem('token', res.data.token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('username', user.username);
    localStorage.setItem('profilePhoto', user.profilePhoto || '');

    alert(res.data.message || "Login successful");
    navigate('/Home'); 
  } catch (err) {
    console.error(err);
    
    // Check if it's an inactive user error
    if (err.response?.data?.message?.includes('inactive')) {
      alert("Your account is inactive. Please contact management.");
    } else {
      alert(err.response?.data?.message || "Login failed");
    }
  }
};
const handleForgotPassword = async () => {
  if (newPassword !== confirmPassword) {
    alert("Passwords don't match!");
    return;
  }
  
  try {
    const res = await axios.post('http://localhost:5000/api/reset-password', {
      email,
      newPassword
    });
    
    alert(res.data.message || "Password updated successfully");
    setOpenForgotPassword(false);
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Password reset failed");
  }
};

  const inputDesign = {
    '& .MuiOutlinedInput-root': {
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
    '& label.Mui-focused': {
      color: '#00c6fb',
    },
  };

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', maxWidth: '100%', overflowX: 'hidden', backgroundColor: '#c9ecf5ff' }}>
     <Grid 
  container 
  sx={{ 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: { xs: 'flex-start', md: 'center' }, 
    p: { xs: 2, md: 0 } 
  }}
>
  {/* Left Side */}
  <Grid 
    item 
    xs={12} 
    md={6} 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center' 
    }}
  >
    <Box
      sx={{
        backgroundColor: '#e6fbf9',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 450,
        height:{md:450,xs:300},
        mt:{md:15},
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#24c6efff', 
            fontWeight:"bold",
            mb: 2, 
            textAlign: 'center', 
            fontSize: { xs: '1.3rem', md: '1.5rem' } 
          }}
        >
          LOGIN
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Name or Email"
            type="text"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#1b2a41' } }}
            sx={inputDesign}
            required
          />
          <TextField
            fullWidth
            margin="normal"
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            InputLabelProps={{ style: { color: '#1b2a41' } }}
            sx={inputDesign}
            required
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ 
              mt: 2, 
              backgroundColor: '#24c6ef', 
              '&:hover': { backgroundColor: '#1cb5e0' }, 
              py: { xs: 1, sm: 1.5 } 
            }}
            type="submit"
          >
            Login
          </Button>
        </form>

        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            mt: 2, 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ color: 'gray', textAlign: { xs: 'center', sm: 'left' } }}
          >
            Don't have an account? <Link to="/userregister">Register here</Link>
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#24c6ef',
              mt: { xs: 1, sm: 0 },
              cursor: 'pointer',
              textAlign: { xs: 'center', sm: 'right' },
              '&:hover': { textDecoration: 'underline' },
            }}
            onClick={() => setOpenForgotPassword(true)}
          >
            Forgot Password?
          </Typography>
        </Box>
      </Box>
    </Box>
  </Grid>

  {/* Right Side */}
  <Grid 
    item 
    md={6} 
    sx={{ 
     
      display: 'flex', 
    }}
  >
    <Box
      sx={{
        width: {md:500,xs:500},
        height:{md:500,xs:300},
        background: 'linear-gradient(to bottom right, #24c6ef, #a8edea)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        mt:{xs:0,md:15}
      }}
    >
      <Box
        sx={{
          width: 120,
          height: 120,
          backgroundColor: '#1b2a41',
          clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <img 
          src='/Images/logo2.png' 
          alt='logo2' 
          style={{ maxWidth: '80%', height: 'auto' }} 
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          color: '#1b2a41',
          textAlign: 'center',
          fontSize: { xs: '1.4rem', md: '2rem' },
        }}
      >
        Welcome Back
      </Typography>
      <Typography
        variant="body1"
        sx={{
          mt: 1,
          color: '#1b2a41',
          textAlign: 'center',
          fontSize: { xs: '0.9rem', md: '1.1rem' },
        }}
      >
        Login to Continue
      </Typography>
    </Box>
  </Grid>
</Grid>


      {/* Forgot Password Dialog */}
      <Dialog open={openForgotPassword} onClose={() => setOpenForgotPassword(false)}>
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            variant="outlined"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Confirm Password"
            type="password"
            fullWidth
            variant="outlined"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForgotPassword(false)}>Cancel</Button>
          <Button 
            onClick={handleForgotPassword}
            variant="contained"
            sx={{ backgroundColor: '#24c6ef', '&:hover': { backgroundColor: '#1cb5e0' } }}
          >
            Reset Password
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;

