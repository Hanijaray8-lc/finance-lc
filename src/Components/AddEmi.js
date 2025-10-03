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
  TextField,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { CheckCircle, Add } from '@mui/icons-material';
import axios from 'axios';
import * as XLSX from 'xlsx';
import AdminSidebar from './Adminsidebar';

const AdminEMIManagement = () => {
  const [emis, setEmis] = useState([]);
  const [loading, setLoading] = useState(false);
const [companies, setCompanies] = useState([]);
const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('');


  // For Add EMI Dialog
  const [openAdd, setOpenAdd] = useState(false);
  const [newEmi, setNewEmi] = useState({
    userName: '',
    loanType: '',
    amount: '',
    dueDate: '',
    companyName:''
  });

  useEffect(() => {
    fetchEmis();
  }, []);

 const fetchEmis = async () => {
  setLoading(true);
  try {
    const res = await axios.get('http://localhost:5000/api/admin/emis');
    setEmis(res.data);
  } catch (error) {
    console.error('Error fetching EMIs:', error);
  }
  setLoading(false);
};


  const handleMarkReceived = async (id) => {
    if (window.confirm('Mark this EMI as received?')) {
      try {
        await axios.put(`/api/admin/emis/${id}/received`);
        fetchEmis();
      } catch (error) {
        console.error('Error updating EMI status:', error);
      }
    }
  };

const handleAddEmi = async () => {
  if (!newEmi.companyName || !newEmi.userName || !newEmi.loanType || !newEmi.amount || !newEmi.dueDate) {
    alert('Please fill all fields');
    return;
  }
  console.log("Adding EMI with data:", newEmi);
  try {
    const res = await axios.post('http://localhost:5000/api/admin/emis', newEmi);
    alert(res.data.message); // Inform user
    setOpenAdd(false);
    setNewEmi({
      userName: '',
      loanType: '',
      amount: '',
      dueDate: '',
      companyName: '' // reset companyName as well
    });
    fetchEmis();
  } catch (error) {
    console.error('Error adding EMI:', error);
    alert('Failed to add EMI. Please check server console for details.');
  }
};




  const generateReport = () => {
    const data = emis.map((e) => ({
      User: e.userName,
      LoanType: e.loanType,
      Amount: e.amount,
      DueDate: new Date(e.dueDate).toLocaleDateString(),
      Status: e.isPaid ? 'Paid' : 'Pending',
      PaidDate: e.paidDate ? new Date(e.paidDate).toLocaleDateString() : '-',
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'EMI_Report');
    XLSX.writeFile(wb, 'EMI_Report.xlsx');
  };



const upcomingEmis = emis.filter((emi) => {
  const unpaid = !emi.isPaid;
  const companyMatch = selectedCompanyFilter ? emi.companyName === selectedCompanyFilter : true;
  return unpaid && companyMatch;
});

const paidEmis = emis.filter((emi) => emi.isPaid);



  
const fetchCompanies = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/financeCompanies');
    setCompanies(res.data);
  } catch (error) {
    console.error('Error fetching companies:', error);
  }
};

useEffect(() => {
  fetchCompanies();
}, []);

  return (
    <>
    <AdminSidebar/>
    <Box sx={{ p: 3, marginLeft: '240px' }}> {/* Adjust marginLeft if you have sidebar */}
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        EMI Management
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        sx={{ mb: 3, mr: 2 }}
        onClick={() => setOpenAdd(true)}
      >
        Add EMI
      </Button>

      <Button variant="contained" onClick={generateReport}>
        Download EMI Report
      </Button>

     <TextField
  select
  label="Filter by Company"
  value={selectedCompanyFilter}
  onChange={(e) => setSelectedCompanyFilter(e.target.value)}
  SelectProps={{ native: true }}
  sx={{ mt: 2, mb: 2, width: '300px' }}
>
  <option value="">All Companies</option>
  {companies.map((company) => (
    <option key={company._id} value={company.name}>
      {company.name}
    </option>
  ))}
</TextField>




      {loading ? (
        <Typography sx={{ mt: 3 }}>Loading...</Typography>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 2, mt: 3, mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Upcoming EMIs
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Loan Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Company</TableCell>

                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {upcomingEmis.map((emi) => (
                  <TableRow key={emi._id}>
                    <TableCell>{emi.userName}</TableCell>
                    <TableCell>{emi.loanType}</TableCell>
                    <TableCell>₹{emi.amount}</TableCell>
                    <TableCell>{emi.companyName}</TableCell>

                    <TableCell>{new Date(emi.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{emi.isPaid ? 'Paid' : 'Pending'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={() => handleMarkReceived(emi._id)}
                        disabled={emi.isPaid}
                      >
                        <CheckCircle color={emi.isPaid ? 'disabled' : 'success'} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>

          <Paper elevation={3} sx={{ p: 2 }}>
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
          </Paper>
        </>
      )}

      {/* Add EMI Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add EMI</DialogTitle>
        <DialogContent>
          <TextField
            label="User Name"
            fullWidth
            value={newEmi.userName}
            onChange={(e) => setNewEmi({ ...newEmi, userName: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Loan Type"
            fullWidth
            value={newEmi.loanType}
            onChange={(e) => setNewEmi({ ...newEmi, loanType: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Amount"
            fullWidth
            type="number"
            value={newEmi.amount}
            onChange={(e) => setNewEmi({ ...newEmi, amount: e.target.value })}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Due Date"
            fullWidth
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newEmi.dueDate}
            onChange={(e) => setNewEmi({ ...newEmi, dueDate: e.target.value })}
            sx={{ mt: 2 }}
          />
  <TextField
  select
  label="Finance Company"
  fullWidth
  value={newEmi.companyName}
  onChange={(e) => setNewEmi({ ...newEmi, companyName: e.target.value })}
  SelectProps={{ native: true }}
  sx={{ mt: 2 }}
>
  <option value="">Select Company</option>
  {companies.map((company) => (
    <option key={company._id} value={company.name}>
      {company.name}
    </option>
  ))}
</TextField>




        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddEmi}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    </>
  );
};

export default AdminEMIManagement;
