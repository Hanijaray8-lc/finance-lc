import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import FeedbackIcon from '@mui/icons-material/Feedback';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import axios from 'axios';

const DashboardCards = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/dashboard-metrics');
        setStats(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#24c6efff', color: 'white' }}>
            <CardContent>
              <InventoryIcon fontSize="large" />
              <Typography variant="h6">Total Products / Services</Typography>
              <Typography variant="h4">{stats.totalProducts}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#fbc02d', color: 'white' }}>
            <CardContent>
              <PeopleIcon fontSize="large" />
              <Typography variant="h6">Total Users</Typography>
              <Typography variant="h4">{stats.totalUsers}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#ff7043', color: 'white' }}>
            <CardContent>
              <FeedbackIcon fontSize="large" />
              <Typography variant="h6">Applications / Feedbacks</Typography>
              <Typography variant="h4">{stats.totalApplications}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#66bb6a', color: 'white' }}>
            <CardContent>
              <DoneAllIcon fontSize="large" />
              <Typography variant="h6">Approved / Pending</Typography>
              <Typography variant="h4">
                {stats.approvedCount} / {stats.pendingCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardCards;


