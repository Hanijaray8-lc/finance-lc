
import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody, Paper, Avatar, Button, TextField
} from '@mui/material';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import PreviewIcon from '@mui/icons-material/Preview';
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const ApprovedCompanies = ({ onEdit, refreshTrigger }) => { // ✅ Add refreshTrigger prop
  const [approved, setApproved] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/financeCompanies/approved');
        setApproved(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchApproved();
    
    // ✅ Refresh when refreshTrigger changes (after update)
  }, [refreshTrigger]); // ✅ Add refreshTrigger as dependency

  const filteredCompanies = approved.filter((c) =>
    `${c.firstName} ${c.name} ${c.companyId}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (company) => {
    setSelectedCompany(company);
  };

  const handleClose = () => {
    setSelectedCompany(null);
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="h4" sx={{ fontWeight: "bold" }}>
          Approved Finance Companies
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{backgroundColor: '#24c6ef',color:"white",border:"none",ml:30}}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </Box>

      <TextField
        label="Search by Name or Company ID"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <Paper>
        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead sx={{ backgroundColor: '#24c6ef' }}>
              <TableRow>
                <TableCell sx={{color:"white",backgroundColor: '#24c6ef',fontWeight:"bold"}}>Logo</TableCell>
                <TableCell sx={{color:"white",backgroundColor: '#24c6ef',fontWeight:"bold"}}>Name</TableCell>
                <TableCell sx={{color:"white",backgroundColor: '#24c6ef',fontWeight:"bold"}}>Company Name/Id</TableCell>
                <TableCell sx={{color:"white",backgroundColor: '#24c6ef',fontWeight:"bold"}}>Email</TableCell>
                <TableCell sx={{color:"white",backgroundColor: '#24c6ef',fontWeight:"bold"}}>Contact Number</TableCell>
                <TableCell sx={{color:"white",backgroundColor: '#24c6ef',fontWeight:"bold"}}>Actions</TableCell>
                <TableCell sx={{ color: 'white',backgroundColor: '#24c6ef', fontWeight: 'bold' }}>View</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCompanies.map((c) => (
                <TableRow key={c._id}>
                  <TableCell>
                    <Avatar src={`http://localhost:5000/uploads/${c.logo}`} />
                  </TableCell>
                  <TableCell>{c.firstName}</TableCell>
                  <TableCell>{c.name}<br /><span>{c.companyId}</span></TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.contactNumber}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => onEdit(c)}
                      sx={{
                        color: 'white',
                        backgroundColor: '#24c6ef',
                        '&:hover': {
                          backgroundColor: '#1976d2',
                          color: '#fff',
                        },
                      }}
                    >
                      Update
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      sx={{
                        color: 'white',
                        backgroundColor: '#24c6ef',
                        minWidth: '40px',
                        padding: '6px 12px',
                        '&:hover': { backgroundColor: '#1976d2', color: '#fff' },
                      }}
                      onClick={() => handleView(c)}
                    >
                      <PreviewIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Paper>

      {/* Dialog remains same */}
      <Dialog
        open={!!selectedCompany}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#e6fbf9',
            boxShadow: 24,
            borderRadius: 3,
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: '#24c6ef',
            color: 'white',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Company Details
        </DialogTitle>

        <DialogContent dividers sx={{ backgroundColor: '#e6fbf9' }}>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar
              src={`http://localhost:5000/uploads/${selectedCompany?.logo}`}
              alt="Logo"
              sx={{ width: 80, height: 80 }}
            />
            <Box width="100%" display="flex" flexDirection="column" gap={1}>
              <DialogContentText><strong>Name:</strong> {selectedCompany?.firstName}</DialogContentText>
              <DialogContentText><strong>Company Name:</strong> {selectedCompany?.name}</DialogContentText>
              <DialogContentText><strong>Company ID:</strong> {selectedCompany?.companyId}</DialogContentText>
              <DialogContentText><strong>Email:</strong> {selectedCompany?.email}</DialogContentText>
              <DialogContentText><strong>Contact Number:</strong> {selectedCompany?.contactNumber}</DialogContentText>
              <DialogContentText><strong>Website:</strong> {selectedCompany?.website}</DialogContentText>
              <DialogContentText><strong>Branch:</strong> {selectedCompany?.branch}</DialogContentText>
              <DialogContentText><strong>Description:</strong> {selectedCompany?.description}</DialogContentText>
              <DialogContentText><strong>Details:</strong> {selectedCompany?.details}</DialogContentText>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={{ backgroundColor: '#e6fbf9', justifyContent: 'center' }}>
          <Button onClick={handleClose} sx={{ backgroundColor: '#24c6ef', color: 'white', '&:hover': { backgroundColor: '#1ca6cc' } }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApprovedCompanies;


