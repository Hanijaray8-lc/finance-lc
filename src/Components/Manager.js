
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginSignup = () => {
  const [tab, setTab] = useState(0);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      await axios.post('http://localhost:5000/api/ManagerAuth/register', form);
      alert('Registered! Please login.');
      setTab(0);
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/ManagerAuth/login', {
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/ManagerDashboard');
      alert("Login Successful!");
    } catch (err) {
      alert(err.response?.data?.msg || 'Error');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#cdebf3ff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          maxWidth: 420,
          width: '100%',
          borderRadius: '16px',
          p: 4,
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
          background: '#e6fbf9',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          fontWeight="bold"
          sx={{ color: '#24c6efff' }}
        >
          Manager Portal
        </Typography>

        <Tabs
          value={tab}
          onChange={(e, newVal) => setTab(newVal)}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Login" />
          <Tab label="Register" />
        </Tabs>

        <Divider sx={{ my: 2 }} />

        <Box>
          {tab === 1 && (
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              margin="normal"
              onChange={handleChange}
              sx={{ background: 'white' }}
            />
          )}

          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            onChange={handleChange}
            sx={{ background: 'white' }}
          />

          {/* Password field with Eye icon */}
          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            onChange={handleChange}
            sx={{ background: 'white' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              fontWeight: 'bold',
              borderRadius: '8px',
              background: '#24c6efff',
            }}
            onClick={tab === 0 ? handleLogin : handleRegister}
          >
            {tab === 0 ? 'Login' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginSignup;


