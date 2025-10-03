import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import { CheckCircle, Cancel, Visibility } from '@mui/icons-material';
import axios from 'axios';

const AdminLoanApplications = () => {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [companyName, setCompanyName] = useState('');


  useEffect(() => {
    fetchApplications();
  },
  
  []  );

  const fetchApplications = async () => {
    try {
      const res = await axios.get('/api/admin/applications');
      setApplications(res.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleApproveReject = async (id, status) => {
    try {
      await axios.put(`/api/admin/applications/${id}/status`, { status });
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.userName.toLowerCase().includes(search.toLowerCase()) ||
      app.loanType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? app.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

   
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Loan Applications Management
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search by user or loan type"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
        />

        <TextField
          select
          label="Filter by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          sx={{ width: 200 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Pending">Pending</MenuItem>
          <MenuItem value="Approved">Approved</MenuItem>
          <MenuItem value="Rejected">Rejected</MenuItem>
        </TextField>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Loan Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {filteredApplications.map((app) => (
            <TableRow key={app._id}>
              <TableCell>{app.userName}</TableCell>
              <TableCell>{app.loanType}</TableCell>
              <TableCell>₹{app.loanAmount}</TableCell>
              <TableCell>{app.status}</TableCell>
              <TableCell align="right">
                <IconButton
                  onClick={() => handleApproveReject(app._id, 'Approved')}
                  disabled={app.status === 'Approved'}
                >
                  <CheckCircle color="success" />
                </IconButton>
                <IconButton
                  onClick={() => handleApproveReject(app._id, 'Rejected')}
                  disabled={app.status === 'Rejected'}
                >
                  <Cancel color="error" />
                </IconButton>
                <IconButton onClick={() => setSelectedApplication(app)}>
                  <Visibility />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* View Documents Dialog */}
      <Dialog
        open={!!selectedApplication}
        onClose={() => setSelectedApplication(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Uploaded Documents</DialogTitle>
        <DialogContent>
          {selectedApplication?.documents?.map((doc, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography>{doc.type}</Typography>
              <a href={doc.url} target="_blank" rel="noopener noreferrer">
                View Document
              </a>
            </Box>
          ))}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminLoanApplications;
