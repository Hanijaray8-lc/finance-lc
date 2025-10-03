import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TableContainer, Typography, Box,
  CircularProgress, TextField, Grid, useTheme, useMediaQuery
} from '@mui/material';
import axios from 'axios';

const LoanHistoryTable = ({ refreshTrigger = false }) => {
  const [loanEntries, setLoanEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchLoanType, setSearchLoanType] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const companyId = localStorage.getItem('companyId');
  const companyName = localStorage.getItem('companyName');

  // Fetch data from API
  const fetchLoanEntries = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/loan-entries');
      const companyEntries = response.data.filter(entry => 
        entry.companyId === companyId
      );
      
      // Sort by latest first (descending order)
      const sortedEntries = companyEntries.sort((a, b) => 
        new Date(b.dueDate) - new Date(a.dueDate)
      );
      
      setLoanEntries(sortedEntries);
      setFilteredEntries(sortedEntries);
      setError('');
    } catch (error) {
      console.error('Error fetching loan history:', error);
      setError('Failed to fetch loan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!companyId) {
      setError('Please login as a company to view payment history.');
      setLoading(false);
      return;
    }
    fetchLoanEntries();
  }, [companyId, refreshTrigger]);

  useEffect(() => {
    const filtered = loanEntries.filter(entry =>
      entry.user.toLowerCase().includes(searchName.toLowerCase()) &&
      entry.loanType.toLowerCase().includes(searchLoanType.toLowerCase())
    );
    setFilteredEntries(filtered);
  }, [searchName, searchLoanType, loanEntries]);

  if (!companyId) {
    return (
      <Box sx={{ p: { md: 3, xs: 2 }, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography>
          Please login as a company to view payment history.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { md: 3, xs: 1 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexDirection={isMobile ? 'column' : 'row'} gap={1}>
        <Typography variant={isMobile ? "h6" : "h5"}>
          Payment History - {companyName}
        </Typography>
        <Typography variant="body2" color="primary">
          Total Entries: {filteredEntries.length}
        </Typography>
      </Box>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Customer Name"
            fullWidth
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            sx={{width:{md:"374px",xs:"310px"}}}

            size="small"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Loan Type"
            fullWidth
            value={searchLoanType}
            onChange={(e) => setSearchLoanType(e.target.value)}
            sx={{width:{md:"374px",xs:"310px"}}}
            size="small"
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Loading loan history...</Typography>
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredEntries.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No payment history found
          </Typography>
        </Box>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            maxHeight: '70vh', 
            overflow: 'auto',
            // Force horizontal scroll on mobile
            minWidth: '100%',
            display: 'block',
            overflowX: 'auto'
          }}
        >
          <Table 
            sx={{ 
              // Fixed table layout for consistent columns
              tableLayout: 'fixed',
              // Minimum width to ensure table doesn't break
              minWidth: isMobile ? 800 : 'auto',
              // Ensure table is visible on mobile
              width: '100%'
            }}
          >
            <TableHead >
              <TableRow>
                <TableCell sx={{ 
                  background: '#24c6ef', 
                  color: "white", 
                  fontWeight: 'bold',
                  width: isMobile ? '150px' : '20%',
                  minWidth: '120px',
                  fontSize: isMobile ? '12px' : '14px'
                }}>
                  Customer Name
                </TableCell>
                <TableCell sx={{ 
                  background: '#24c6ef', 
                  color: "white", 
                  fontWeight: 'bold',
                  width: isMobile ? '120px' : '15%',
                  minWidth: '100px',
                  fontSize: isMobile ? '12px' : '14px'
                }}>
                  Loan Type
                </TableCell>
                <TableCell sx={{ 
                  background: '#24c6ef', 
                  color: "white", 
                  fontWeight: 'bold',
                  width: isMobile ? '120px' : '15%',
                  minWidth: '100px',
                  fontSize: isMobile ? '12px' : '14px'
                }}>
                  Loan Amount
                </TableCell>
                <TableCell sx={{ 
                  background: '#24c6ef', 
                  color: "white", 
                  fontWeight: 'bold',
                  width: isMobile ? '120px' : '15%',
                  minWidth: '100px',
                  fontSize: isMobile ? '12px' : '14px'
                }}>
                  Monthly EMI
                </TableCell>
                <TableCell sx={{ 
                  background: '#24c6ef', 
                  color: "white", 
                  fontWeight: 'bold',
                  width: isMobile ? '120px' : '17%',
                  minWidth: '100px',
                  fontSize: isMobile ? '12px' : '14px'
                }}>
                  Due Date
                </TableCell>
                <TableCell sx={{ 
                  background: '#24c6ef', 
                  color: "white", 
                  fontWeight: 'bold',
                  width: isMobile ? '120px' : '18%',
                  minWidth: '100px',
                  fontSize: isMobile ? '12px' : '14px'
                }}>
                  Paid Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntries.map((loan, index) => (
                <TableRow key={index} sx={{ 
                  backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white',
                  '&:hover': { backgroundColor: '#f0f8ff' }
                }}>
                  <TableCell sx={{ 
                    fontSize: isMobile ? '12px' : '14px',
                    width: isMobile ? '150px' : '20%',
                    minWidth: '120px'
                  }}>
                    {loan.user}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: isMobile ? '12px' : '14px',
                    width: isMobile ? '120px' : '15%',
                    minWidth: '100px'
                  }}>
                    {loan.loanType}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: isMobile ? '12px' : '14px',
                    width: isMobile ? '120px' : '15%',
                    minWidth: '100px'
                  }}>
                    ₹{loan.loanAmount}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: isMobile ? '12px' : '14px',
                    width: isMobile ? '120px' : '15%',
                    minWidth: '100px'
                  }}>
                    ₹{loan.emiAmount}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: isMobile ? '12px' : '14px',
                    width: isMobile ? '120px' : '17%',
                    minWidth: '100px'
                  }}>
                    {formatDate(loan.dueDate)}
                  </TableCell>
                  <TableCell sx={{ 
                    fontSize: isMobile ? '12px' : '14px',
                    width: isMobile ? '120px' : '18%',
                    minWidth: '100px'
                  }}>
                    {formatDate(loan.paidDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Mobile scroll indicator */}
      {isMobile && filteredEntries.length > 0 && (
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            ↸ Scroll horizontally to view full table ↹
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default LoanHistoryTable;
{/*import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TableContainer, Typography, Box,
  CircularProgress, TextField, Grid, useTheme, useMediaQuery,
  Card, CardContent, Stack, Button
} from '@mui/material';
import axios from 'axios';

const LoanHistoryTable = ({ newLoanData = null }) => { // Add this prop
  const [loanEntries, setLoanEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchLoanType, setSearchLoanType] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const companyId = localStorage.getItem('companyId');
  const companyName = localStorage.getItem('companyName');

  // Fetch data from API
  const fetchLoanEntries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/loan-entries');
      const companyEntries = response.data.filter(entry => 
        entry.companyId === companyId
      );
      setLoanEntries(companyEntries);
      setFilteredEntries(companyEntries);
    } catch (error) {
      console.error('Error fetching loan history:', error);
      setError('Failed to fetch loan history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!companyId) {
      setError('Please login as a company to view payment history.');
      setLoading(false);
      return;
    }
    fetchLoanEntries();
  }, [companyId]);

  // IMPORTANT: Add new data immediately when form is submitted
  useEffect(() => {
    if (newLoanData && newLoanData.companyId === companyId) {
      setLoanEntries(prevEntries => [newLoanData, ...prevEntries]);
      setFilteredEntries(prevEntries => [newLoanData, ...prevEntries]);
    }
  }, [newLoanData, companyId]);

  useEffect(() => {
    const filtered = loanEntries.filter(entry =>
      entry.user.toLowerCase().includes(searchName.toLowerCase()) &&
      entry.loanType.toLowerCase().includes(searchLoanType.toLowerCase())
    );
    setFilteredEntries(filtered);
  }, [searchName, searchLoanType, loanEntries]);

  // Mobile Card View
  const MobileLoanCard = ({ loan }) => (
    <Card sx={{ mb: 2, p: 2, backgroundColor: '#fff' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {loan.user}
          </Typography>
          <Typography variant="body2">
            <strong>Loan Type:</strong> {loan.loanType}
          </Typography>
          <Typography variant="body2">
            <strong>Amount:</strong> ₹{loan.loanAmount}
          </Typography>
          <Typography variant="body2">
            <strong>Monthly EMI:</strong> ₹{loan.emiAmount}
          </Typography>
          <Typography variant="body2">
            <strong>Due Date:</strong> {formatDate(loan.dueDate)}
          </Typography>
          <Typography variant="body2">
            <strong>Paid Date:</strong> {formatDate(loan.paidDate)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  if (!companyId) {
    return (
      <Box sx={{ p: { md: 3, xs: 2 }, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography>
          Please login as a company to view payment history.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { md: 3, xs: 2 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">
          Payment History - {companyName}
        </Typography>
     
      </Box>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Customer Name"
            fullWidth
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Loan Type"
            fullWidth
            value={searchLoanType}
            onChange={(e) => setSearchLoanType(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredEntries.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No payment history found
          </Typography>
        </Box>
      ) : isMobile ? (
        <Box>
          {filteredEntries.map((loan, index) => (
            <MobileLoanCard key={index} loan={loan} />
          ))}
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}><strong>Customer Name</strong></TableCell>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}><strong>Loan Type</strong></TableCell>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}><strong>Loan Amount</strong></TableCell>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}><strong>Monthly EMI</strong></TableCell>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}><strong>Due Date</strong></TableCell>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}><strong>Paid Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntries.map((loan, index) => (
                <TableRow key={index}>
                  <TableCell>{loan.user}</TableCell>
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

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default LoanHistoryTable;
{/*import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TableContainer, Typography, Box,
  CircularProgress, TextField, Grid, useTheme, useMediaQuery,
  Card, CardContent, Stack
} from '@mui/material';
import axios from 'axios';

const LoanHistoryTable = () => {
  const [loanEntries, setLoanEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchLoanType, setSearchLoanType] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Get company info from localStorage
  const companyId = localStorage.getItem('companyId');
  const companyName = localStorage.getItem('companyName');

  useEffect(() => {
    if (!companyId) {
      setError('Please login as a company to view payment history.');
      setLoading(false);
      return;
    }

    axios.get('http://localhost:5000/api/loan-entries')
      .then(response => {
        // Filter entries to show only those belonging to the logged-in company
        const companyEntries = response.data.filter(entry => 
          entry.companyId === companyId
        );
        
        setLoanEntries(companyEntries);
        setFilteredEntries(companyEntries);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching loan history:', error);
        setError('Failed to fetch loan history.');
        setLoading(false);
      });
  }, [companyId]);

  useEffect(() => {
    const filtered = loanEntries.filter(entry =>
      entry.user.toLowerCase().includes(searchName.toLowerCase()) &&
      entry.loanType.toLowerCase().includes(searchLoanType.toLowerCase())
    );
    setFilteredEntries(filtered);
  }, [searchName, searchLoanType, loanEntries]);

  // Mobile Card View
  const MobileLoanCard = ({ loan }) => (
    <Card sx={{ mb: 2, p: 2, backgroundColor: '#fff' }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6" fontWeight="bold" color="primary">
            {loan.user}
          </Typography>
          <Typography variant="body2">
            <strong>Loan Type:</strong> {loan.loanType}
          </Typography>
          <Typography variant="body2">
            <strong>Amount:</strong> ₹{loan.loanAmount}
          </Typography>
          <Typography variant="body2">
            <strong>Monthly EMI:</strong> ₹{loan.emiAmount}
          </Typography>
          <Typography variant="body2">
            <strong>Due Date:</strong> {formatDate(loan.dueDate)}
          </Typography>
          <Typography variant="body2">
            <strong>Paid Date:</strong> {formatDate(loan.paidDate)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );

  if (!companyId) {
    return (
      <Box sx={{ p: { md: 3, xs: 2 }, textAlign: 'center' }}>
        <Typography variant="h5" color="error" gutterBottom>
          Access Denied
        </Typography>
        <Typography>
          Please login as a company to view payment history.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { md: 3, xs: 2 } }}>
      <Typography variant="h5" gutterBottom>
        Payment History - {companyName}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Viewing payment history for your company
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Customer Name"
            fullWidth
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Loan Type"
            fullWidth
            value={searchLoanType}
            onChange={(e) => setSearchLoanType(e.target.value)}
            size={isMobile ? "small" : "medium"}
          />
        </Grid>
      </Grid>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredEntries.length === 0 ? (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No payment history found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {loanEntries.length === 0 
              ? "Your company doesn't have any loan entries yet."
              : "No entries match your search criteria."
            }
          </Typography>
        </Box>
      ) : isMobile ? (
        // Mobile View - Cards
        <Box>
          {filteredEntries.map((loan, index) => (
            <MobileLoanCard key={index} loan={loan} />
          ))}
        </Box>
      ) : (
        // Desktop View - Table
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}>
                  <strong>Customer Name</strong>
                </TableCell>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}>
                  <strong>Loan Type</strong>
                </TableCell>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}>
                  <strong>Loan Amount</strong>
                </TableCell>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}>
                  <strong>Monthly EMI</strong>
                </TableCell>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}>
                  <strong>Due Date</strong>
                </TableCell>
                <TableCell sx={{ background: '#24c6ef', color: "white" }}>
                  <strong>Paid Date</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntries.map((loan, index) => (
                <TableRow key={index}>
                  <TableCell>{loan.user}</TableCell>
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
      
      {filteredEntries.length > 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Showing {filteredEntries.length} of {loanEntries.length} entries
        </Typography>
      )}
    </Box>
  );
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default LoanHistoryTable;*/}
{/*import React, { useEffect, useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  Paper, TableContainer, Typography, Box,
  CircularProgress, TextField, Grid
} from '@mui/material';
import axios from 'axios';

const LoanHistoryTable = () => {
  const [loanEntries, setLoanEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchLoanType, setSearchLoanType] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/loan-entries')
      .then(response => {
        setLoanEntries(response.data);
        setFilteredEntries(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching loan history:', error);
        setError('Failed to fetch loan history.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = loanEntries.filter(entry =>
      entry.user.toLowerCase().includes(searchName.toLowerCase()) &&
      entry.loanType.toLowerCase().includes(searchLoanType.toLowerCase())
    );
    setFilteredEntries(filtered);
  }, [searchName, searchLoanType, loanEntries]);

  return (
    <Box sx={{p:{md:3,xs:0}}}>
      <Typography variant="h5" gutterBottom>
        Payment History
      </Typography>

      <Grid container spacing={2} mb={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Name"
            fullWidth
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            sx={{width:{md:"373px",xs:"330px"}}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Search by Loan Type"
            fullWidth
            value={searchLoanType}
            onChange={(e) => setSearchLoanType(e.target.value)}
            sx={{width:{md:"373px",xs:"330px"}}}

          />
        </Grid>
      </Grid>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : filteredEntries.length === 0 ? (
        <Typography>No matching loan history found.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{background:'#24c6efff',color:"white"}}><strong>Name</strong></TableCell>
                <TableCell sx={{background:'#24c6efff',color:"white"}}><strong>Loan Type</strong></TableCell>
                <TableCell sx={{background:'#24c6efff',color:"white"}}><strong>Loan Amount</strong></TableCell>
                <TableCell sx={{background:'#24c6efff',color:"white"}}><strong>Monthly EMI</strong></TableCell>
                <TableCell sx={{background:'#24c6efff',color:"white"}}><strong>Due Date</strong></TableCell>
                <TableCell sx={{background:'#24c6efff',color:"white"}}><strong>Paid Date</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEntries.map((loan, index) => (
                <TableRow key={index}>
                  <TableCell>{loan.user}</TableCell>
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

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

export default LoanHistoryTable;*/}

