import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress, Button
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const UserLoanHistory = () => {
  const [loanEntries, setLoanEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.email) {
      setUserEmail(storedUser.email);
    } else {
      setError("No user found. Please login again.");
      setLoading(false);
    }
  }, []);

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userName = storedUser?.name;

  useEffect(() => {
    axios.get(`http://localhost:5000/api/loan-entries/name/${userName}`)
      .then(response => {
        setLoanEntries(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching loan history:', error);
        setError('Failed to fetch your loan history.');
        setLoading(false);
      });
  }, [userName]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Box p={3} sx={{ backgroundColor: '#cdebf3ff', height: '100vh' }}>
      {/* Back Button */}
     <Box 
  display="flex" 
  alignItems="center" 
  justifyContent="space-between" 
  sx={{ mb: 2,gap:{xs:10} }}
>
  {/* Back Button */}
  <Button
  variant="contained"
onClick={() => navigate('/TrackHistory')}
  sx={{
    backgroundColor: '#24c6efff',
    '&:hover': { backgroundColor: '#1faed1' }
  }}
>
  Back
</Button>


  {/* Heading */}
  <Typography 
    variant="h5" 
    sx={{ 
      color: '#24c6efff', 
      flex: 1, 
    ml:{md:60},
    fontSize:{md:30,xs:20}
    }}
  >
    Your Loan History
  </Typography>
</Box>


      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : loanEntries.length === 0 ? (
        <Typography>No loan history found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#24c6efff' }}>
                <TableCell sx={{ color: "white" }}><strong>Loan Type</strong></TableCell>
                <TableCell sx={{ color: "white" }}><strong>Amount</strong></TableCell>
                <TableCell sx={{ color: "white" }}><strong>EMI</strong></TableCell>
                <TableCell sx={{ color: "white" }}><strong>Due Date</strong></TableCell>
                <TableCell sx={{ color: "white" }}><strong>Paid Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanEntries.map((loan, index) => (
                <TableRow key={index} sx={{ background: '#e6fbf9' }}>
                  <TableCell>{loan.loanType}</TableCell>
                  <TableCell>₹{loan.loanAmount}</TableCell>
                  <TableCell>₹{loan.emiAmount}</TableCell>
                  <TableCell>{formatDate(loan.dueDate)}</TableCell>
                  <TableCell>{formatDate(loan.paidDate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UserLoanHistory;

