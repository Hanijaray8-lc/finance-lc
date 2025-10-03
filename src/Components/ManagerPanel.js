import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableBody, TableRow, TableCell,
  TextField, Paper, Avatar, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, Grid
} from '@mui/material';
import axios from 'axios';
       import { TableContainer } from '@mui/material';
       import { useNavigate } from 'react-router-dom';


const ManagerPanel = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [open, setOpen] = useState(false);
   const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/financeCompanies');
        setCompanies(res.data);
      } catch (err) {
        console.error('Error fetching companies:', err);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter(
    (c) =>
      c.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      c.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleView = (company) => {
    setSelectedCompany(company);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedCompany(null);
  };

const handleApprove = async (id) => {
  try {
    const res = await axios.put(`http://localhost:5000/api/financeCompanies/${id}/approve`);
    // Update the state with the newly approved company
    setCompanies((prevCompanies) => 
      prevCompanies.map((company) => 
        company._id === id ? { ...company, status: 'approved' } : company
      )
    );
    alert(res.data.message);
  } catch (error) {
    console.error("Approve error:", error);
  }
};

const handleReject = async (id) => {
  try {
    const res = await axios.put(`http://localhost:5000/api/financeCompanies/${id}/reject`);
    // Update the state with the newly rejected company
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) => 
        company._id === id ? { ...company, status: 'rejected' } : company
      )
    );
    alert(res.data.message);
  } catch (err) {
    console.error('Reject error:', err);
  }
};


  return (
    <Box sx={{ padding: 4, background: '#f0f8ff', minHeight: '100vh' }}>
      <Grid sx={{display:"flex",gap:{md:"1161px",xs:13.5},mb:1}}>
      <Typography variant={{md:"h4",xs:"h5"}} sx={{ fontWeight: 'bold',  }}>
        Manager Panel
      </Typography>

   <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1, color: "white", background: '#24c6ef',ml:{md:13,xs:0} }}
                onClick={() => navigate(-1)}

            >
           Back
            </Button>
  </Grid>
      <TextField
        label="Search by Name or Company"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 3, backgroundColor: '#fff' }}
      />

      <Paper elevation={3}>

<TableContainer component={Box} sx={{ maxHeight: 500, overflow: 'auto' }}>
  <Table stickyHeader> {/* stickyHeader keeps the header fixed while scrolling */}
    <TableHead sx={{ backgroundColor: '#24c6ef' }}>
      <TableRow>
        <TableCell sx={{ color: 'white',backgroundColor: '#24c6ef' }}><strong>Logo</strong></TableCell>
        <TableCell sx={{ color: 'white',backgroundColor: '#24c6ef' }}><strong>First Name</strong></TableCell>
        <TableCell sx={{ color: 'white',backgroundColor: '#24c6ef' }}><strong>Company Name/Id</strong></TableCell>
        <TableCell sx={{ color: 'white',backgroundColor: '#24c6ef' }}><strong>Email</strong></TableCell>
        <TableCell sx={{ color: 'white',backgroundColor: '#24c6ef' }}><strong>Contact</strong></TableCell>
        <TableCell sx={{ color: 'white',backgroundColor: '#24c6ef' }}><strong>View</strong></TableCell>
        <TableCell sx={{ color: 'white',backgroundColor: '#24c6ef' }}><strong>Approved</strong></TableCell>
        <TableCell sx={{ color: 'white',backgroundColor: '#24c6ef' }}><strong>Rejected</strong></TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredCompanies.map((company) => (
        <TableRow key={company._id}>
          <TableCell>
            {company.logo && (
              <Avatar
                alt={company.name}
                src={`http://localhost:5000/uploads/${company.logo}`}
              />
            )}
          </TableCell>
          <TableCell>{company.firstName}</TableCell>
          <TableCell>
            {company.name}<br /><span>{company.companyId}</span>
          </TableCell>
          <TableCell>{company.email}</TableCell>
          <TableCell>{company.contactNumber}</TableCell>
          <TableCell>
            <Button
              variant="outlined"
              size="small"
              sx={{ mr: 1, color: "white", background: '#24c6ef' }}
              onClick={() => handleView(company)}
            >
              View
            </Button>
          </TableCell>
    

  <TableCell>
    {company.status === 'approved' ? (
      <Button variant="contained" color="success" disabled>Approved</Button>
    ) : (
      <Button
        variant="contained"
        color="success"
        size="small"
        sx={{ mr: 1,px:3 }}
        onClick={() => handleApprove(company._id)}
      >
        Approve
      </Button>
    )}
  </TableCell>
  <TableCell>
    {company.status === 'rejected' ? (
      <Button variant="contained" color="error" disabled>Rejected</Button>
    ) : (
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={() => handleReject(company._id)}
        sx={{px:3.5}}
      >
        Reject
      </Button>
    )}
  </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>




      </Paper>

      {/* Dialog for Viewing Details */}
   <Dialog
  open={open}
  onClose={handleClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      backgroundColor: '#e6fbf9',
      borderRadius: 3,
      boxShadow: 24,
    },
  }}
  BackdropProps={{
    sx: {
      backdropFilter: 'blur(4px)',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
  }}
>
  <DialogTitle
    sx={{
      backgroundColor: '#24c6ef',
      color: 'white',
      textAlign: 'center',
      fontWeight: 'bold',
    }}
  >
    Company Details
  </DialogTitle>

  <DialogContent dividers sx={{ backgroundColor: '#e6fbf9' }}>
    {selectedCompany && (
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography><strong>First Name:</strong> {selectedCompany.firstName}</Typography>
        <Typography><strong>Password:</strong> {selectedCompany.password}</Typography>
        <Typography><strong>Company Name:</strong> {selectedCompany.name}</Typography>
                <Typography><strong>Company Id:</strong> {selectedCompany.companyId}</Typography>

        <Typography><strong>Email:</strong> {selectedCompany.email}</Typography>
        <Typography><strong>Contact Number:</strong> {selectedCompany.contactNumber}</Typography>
        <Typography><strong>Website:</strong> {selectedCompany.website}</Typography>
        <Typography><strong>Branch:</strong> {selectedCompany.branch}</Typography>
        <Typography><strong>Description:</strong> {selectedCompany.description}</Typography>
        <Typography><strong>Details:</strong> {selectedCompany.details}</Typography>

        {selectedCompany.logo && (
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography><strong>Logo:</strong></Typography>
            <Avatar
              src={`http://localhost:5000/uploads/${selectedCompany.logo}`}
              alt="Logo"
              sx={{ width: 100, height: 100, mt: 1 }}
            />
          </Box>
        )}
      </Box>
    )}
  </DialogContent>

  <DialogActions sx={{ backgroundColor: '#e6fbf9', justifyContent: 'center' }}>
    <Button
      onClick={handleClose}
      sx={{
        backgroundColor: '#24c6ef',
        color: 'white',
        '&:hover': { backgroundColor: '#1ca6cc' },
      }}
    >
      Close
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default ManagerPanel;
