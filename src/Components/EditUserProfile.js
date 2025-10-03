import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Avatar,
  Paper,
  Typography
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
  const [formData, setFormData] = useState({ name: '', email: '', profilePhoto: null });
  const [preview, setPreview] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/userprofile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        name: res.data.user.name,
        email: res.data.user.email,
        profilePhoto: null
      });
      if (res.data.user.profilePhoto) {
        setPreview(`http://localhost:5000/uploads/${res.data.user.profilePhoto}`);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePhoto' && files.length > 0) {
      setFormData({ ...formData, profilePhoto: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    if (formData.profilePhoto) {
      form.append('profilePhoto', formData.profilePhoto);
    }

    await axios.put('http://localhost:5000/api/edituserprofile', form, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
    });

    navigate('/UserProfilePage');
  };

  return (
    <Box sx={{ p: 4, backgroundColor: '#cdebf3ff', minHeight: '100vh' }}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 500,
          mx: 'auto',
          p: 4,
          borderRadius: 4,
          backgroundColor:  '#e6fbf9' 
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', mb: 3, color: '#24c6efff', textAlign: 'center' }}
        >
          ✏️ Edit Profile
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar src={preview} sx={{ width: 100, height: 100, mb: 2 }} />

          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" component="label" sx={{ backgroundColor: '#24c6efff', mb: 2 }}>
            Upload Photo
            <input hidden type="file" name="profilePhoto" onChange={handleChange} />
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{ backgroundColor: '#24c6efff' }}
          >
            💾 Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditProfile;

