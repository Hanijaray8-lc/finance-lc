import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import axios from 'axios';

const NotificationList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.name) {
          setUserName(parsedUser.name);
          fetchAnnouncements(parsedUser.name);
        }
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
      }
    }
  }, []);

  const fetchAnnouncements = async (user) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/Notification?user=${encodeURIComponent(user)}`);
      setAnnouncements(res.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };




  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Notifications for <span style={{ color: '#24c6ef' }}>{userName}</span>
      </Typography>

      {announcements.length === 0 ? (
        <Typography>No notifications yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {announcements.map((a) => (
            <Grid item xs={12} md={6} key={a._id}>
              <Paper sx={{ p: 2 }}>
                <Typography><strong>Company:</strong> {a.company}</Typography>
                <Typography><strong>User:</strong> {a.user}</Typography>
                <Typography><strong>Due Date:</strong> {new Date(a.dueDate).toLocaleDateString()}</Typography>
                <Typography sx={{ mt: 1 }}>{a.description}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                  Posted on: {new Date(a.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default NotificationList;
