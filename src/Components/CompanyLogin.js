import React, { useState } from 'react';
import {
  Box, TextField, Button, Typography, Paper, InputAdornment, IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CompanyLogin = () => {
  const [formData, setFormData] = useState({ name: '', companyId: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/financeCompanies/login', formData);
      window.alert(res.data.message);
      localStorage.setItem('companyId', res.data.companyId);
      localStorage.setItem('companyName', res.data.company.name);
      navigate('/FinanceDashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        background: '#cdebf3ff',
        height: '100vh',
        pt: '100px',
      }}
    >
      <Paper elevation={4} sx={{ p: 4, width: 400, backgroundColor: '#e6fbf9', height: '50vh' }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Company Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Company Name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2, background: 'white' }}
          />
          <TextField
            name="companyId"
            label="Company ID"
            fullWidth
            value={formData.companyId}
            onChange={handleChange}
            sx={{ mb: 2, background: 'white' }}
          />
          <TextField
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            value={formData.password}
            onChange={handleChange}
            sx={{ mb: 2, background: 'white' }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button
            type="submit"
            fullWidth
            sx={{ backgroundColor: '#24c6ef', color: 'white', mt: 2 }}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CompanyLogin;


