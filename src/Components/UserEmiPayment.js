import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import axios from 'axios';

const UserEMIPayment = () => {
  const [emis, setEmis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEmi, setSelectedEmi] = useState(null);

  // Sample: Assume userName from login context
  const userName = 'Muthu Lakshmi';

  useEffect(() => {
    fetchUserEmis();
  }, []);

  const fetchUserEmis = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/user/emis/${userName}`);
      setEmis(res.data);
    } catch (error) {
      console.error('Error fetching user EMIs:', error);
    }
    setLoading(false);
  };

  const handlePayEmi = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/user/emis/${id}/pay`);
      alert('Payment successful!');
      fetchUserEmis();
      setSelectedEmi(null);
    } catch (error) {
      console.error('Error paying EMI:', error);
      alert('Payment failed!');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        My EMI Notifications
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Loan Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emis.map((emi) => (
                <TableRow key={emi._id}>
                  <TableCell>{emi.loanType}</TableCell>
                  <TableCell>₹{emi.amount}</TableCell>
                  <TableCell>{new Date(emi.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{emi.isPaid ? 'Paid' : 'Pending'}</TableCell>
                  <TableCell>
                    {!emi.isPaid && (
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => setSelectedEmi(emi)}
                      >
                        Pay Now
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Payment Dialog */}
      <Dialog open={!!selectedEmi} onClose={() => setSelectedEmi(null)}>
        <DialogTitle>Pay EMI</DialogTitle>
        <DialogContent>
          {selectedEmi && (
            <>
              <Typography><strong>Loan Type:</strong> {selectedEmi.loanType}</Typography>
              <Typography><strong>Amount:</strong> ₹{selectedEmi.amount}</Typography>
              <Typography><strong>Due Date:</strong> {new Date(selectedEmi.dueDate).toLocaleDateString()}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedEmi(null)}>Cancel</Button>
          <Button variant="contained" onClick={() => handlePayEmi(selectedEmi._id)}>
            Pay Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserEMIPayment;
