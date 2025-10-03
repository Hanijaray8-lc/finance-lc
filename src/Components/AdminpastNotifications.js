import React, { useState, useEffect } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Paper, Typography, Box
} from '@mui/material';
import axios from 'axios';

const AnnouncementTable = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState('');


  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/Notification');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

    fetchAnnouncements();
  

  const filtered = announcements.filter((a) =>
    a.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Company Announcements</Typography>

      <TextField
        label="Search by Company Name"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Paper>
        <Table>
          <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
            <TableRow>
              <TableCell><strong>Company</strong></TableCell>
              <TableCell><strong>User</strong></TableCell>
              <TableCell><strong>Due Date</strong></TableCell>
              <TableCell><strong>Description</strong></TableCell>
              <TableCell><strong>Posted On</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.length > 0 ? (
              filtered.map((a) => (
                <TableRow key={a._id}>
                  <TableCell>{a.company}</TableCell>
                  <TableCell>{a.user}</TableCell>
                  <TableCell>{new Date(a.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{a.description}</TableCell>
                  <TableCell>{new Date(a.createdAt).toLocaleString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">No matching announcements found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default AnnouncementTable;
