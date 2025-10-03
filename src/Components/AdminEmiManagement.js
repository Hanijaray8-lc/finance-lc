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
  Button,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import axios from 'axios';
import * as XLSX from 'xlsx';

const AdminEMIManagement = () => {
  const [emis, setEmis] = useState([]);

  useEffect(() => {
    fetchEmis();
  }, []);

  const fetchEmis = async () => {
    try {
      const res = await axios.get('/api/admin/emis');
      setEmis(res.data);
    } catch (error) {
      console.error('Error fetching EMIs:', error);
    }
  };


 

  const upcomingEmis = emis.filter((emi) => !emi.isPaid);
  const paidEmis = emis.filter((emi) => emi.isPaid);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        EMI Management
      </Typography>

    

     

      <Typography variant="h6" sx={{ mb: 2 }}>
        Payment History
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Loan Type</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Due Date</TableCell>
            <TableCell>Paid Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paidEmis.map((emi) => (
            <TableRow key={emi._id}>
              <TableCell>{emi.userName}</TableCell>
              <TableCell>{emi.loanType}</TableCell>
              <TableCell>₹{emi.amount}</TableCell>
              <TableCell>{new Date(emi.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(emi.paidDate).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default AdminEMIManagement;

