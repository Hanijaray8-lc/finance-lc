import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import AdminSidebar from './Adminsidebar';
import LoanHistoryTable from './LoanHistryTable';

const LoanEntryForm = () => {
  const companyId = localStorage.getItem('companyId') || '';
  const [formData, setFormData] = useState({
    user: '',
    loanType: '',
    loanAmount: '',
    emiAmount: '',
    dueDate: '',
    paidDate: '',
    isAutoFilled: false
  });

  const [userNames, setUserNames] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingLoan, setFetchingLoan] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newLoanAdded, setNewLoanAdded] = useState(false);

  const loanTypes = ['Home Loan', 'Car Loan', 'Personal Loan', 'Education Loan'];

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/loan/applicants', {
          params: { companyId }
        });
        const names = [...new Set(response.data.map(app => app.name))];
        setUserNames(names);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError('Failed to load applicant data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [companyId]);

  useEffect(() => {
    const storedName = localStorage.getItem('companyName');
    if (storedName) setCompanyName(storedName);
  }, []);

  const handleUserChange = async (e) => {
    const selectedUserName = e.target.value.trim();
    setFormData(prev => ({
      ...prev,
      user: selectedUserName,
      isAutoFilled: false
    }));

    if (!selectedUserName) return;

    setFetchingLoan(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/loan/applicant-loan/${companyId}/${encodeURIComponent(selectedUserName)}`
      );

      if (response.data?.success && response.data.data) {
        const { loanType, loanAmount } = response.data.data;

        const normalizedLoanType = loanTypes.find(type =>
          type.toLowerCase() === loanType?.toLowerCase()
        ) || '';

        setFormData(prev => ({
          ...prev,
          loanType: normalizedLoanType,
          loanAmount: loanAmount || '',
          isAutoFilled: !!normalizedLoanType
        }));

        if (!normalizedLoanType) {
          setError(`Loan type '${loanType}' not found in dropdown`);
        }
      } else {
        setError(response.data?.message || 'No loan data found');
      }
    } catch (err) {
      console.error('Error fetching loan details:', err);
      setError('Failed to fetch loan details');
    } finally {
      setFetchingLoan(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'loanType' || name === 'loanAmount' ? { isAutoFilled: false } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.user || !formData.loanType || !formData.loanAmount ||
        !formData.emiAmount || !formData.dueDate) {
        throw new Error('Please fill all required fields');
      }

      const payload = {
        ...formData,
        companyId,
        dueDate: new Date(formData.dueDate).toISOString(),
        paidDate: formData.paidDate ? new Date(formData.paidDate).toISOString() : null
      };

      const response = await axios.post('http://localhost:5000/api/loan-entries/entries', payload);

      if (response.data.success) {
        setSuccess('Loan entry saved successfully!');
        alert('Loan entry saved successfully!');
        
        // Trigger table refresh
        setNewLoanAdded(prev => !prev);
        
        // Reset form
        setFormData({
          user: '',
          loanType: '',
          loanAmount: '',
          emiAmount: '',
          dueDate: '',
          paidDate: '',
          isAutoFilled: false
        });
      } else {
        throw new Error(response.data.message || 'Failed to save loan entry');
      }
    } catch (err) {
      console.error('Error saving loan entry:', err);
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box sx={{ 
      height: "100vh", 
      backgroundImage: 'linear-gradient(to bottom right, #cdebf3ff, #aae3f0ff)',
    }}>
      <AdminSidebar />
      <Box sx={{ display: 'flex', mt: { md: 3, xs: 0 } }}>
        <Grid container spacing={4} alignItems="flex-start" sx={{ width: '100%', px: { md: 4, xs: 0 }, display: 'flex' }}>
          <Grid item xs={12} md={5} sx={{ width: "400px", ml: { md: '120px', xs: 0 }, mr: { md: 0, xs: 2 } }}>
            <Box
              p={4}
              borderRadius={3}
              sx={{
                background: '#e6fbf9',
                border: '1px solid #b2ebf2',
                width: "300px", 
                ml: { md: "100px", xs: 0 },
                position: 'relative'
              }}
            >
              <Typography
                variant="h5"
                align="center"
                sx={{ mb: 1, fontWeight: 600, color: '#0288d1' }}
              >
                {companyName ? `Loan Entry for - ${companyName}` : 'Loading Company...'}
              </Typography>

              <Typography
                variant="subtitle1"
                align="center"
                sx={{ mb: 3, color: '#555' }}
              >
                Fill in the details below
              </Typography>

              {/* Alert Messages - Fixed Position */}
              <Box sx={{ position: 'absolute', top: 10, left: 0, right: 0, zIndex: 1000 }}>
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 2, 
                      mx: 2,
                      animation: 'fadeIn 0.5s ease-in'
                    }}
                    onClose={() => setError(null)}
                  >
                    {error}
                  </Alert>
                )}
              
              </Box>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <TextField
                      label="User Name"
                      name="user"
                      value={formData.user}
                      onChange={handleUserChange}
                      fullWidth
                      required
                      select
                      sx={{ backgroundColor: '#ffffff', borderRadius: 1, width: "300px" }}
                    >
                      {loading ? (
                        <MenuItem>Loading users...</MenuItem>
                      ) : (
                        userNames.map((name, idx) => (
                          <MenuItem key={idx} value={name}>{name}</MenuItem>
                        ))
                      )}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Loan Type"
                      name="loanType"
                      value={formData.loanType}
                      onChange={handleChange}
                      select
                      fullWidth
                      required
                      disabled={fetchingLoan}
                      sx={{ backgroundColor: '#ffffff', borderRadius: 1, width: "300px" }}
                    >
                      <MenuItem value="" disabled>Select loan type</MenuItem>
                      {loanTypes.map((type) => (
                        <MenuItem key={type} value={type}>{type}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Loan Amount"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleChange}
                      type="number"
                      fullWidth
                      required
                      disabled={fetchingLoan}
                      sx={{ backgroundColor: '#ffffff', borderRadius: 1, width: "300px" }}
                      InputProps={{
                        endAdornment: fetchingLoan ? <CircularProgress size={20} /> : null
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Monthly EMI Amount"
                      name="emiAmount"
                      value={formData.emiAmount}
                      onChange={handleChange}
                      type="number"
                      fullWidth
                      required
                      sx={{ backgroundColor: '#ffffff', borderRadius: 1, width: "300px" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Due Date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleChange}
                      type="date"
                      fullWidth
                      required
                      InputLabelProps={{ shrink: true }}
                      sx={{ backgroundColor: '#ffffff', borderRadius: 1, width: "300px" }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Paid Date"
                      name="paidDate"
                      value={formData.paidDate}
                      onChange={handleChange}
                      type="date"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      sx={{ backgroundColor: '#ffffff', borderRadius: 1, width: "300px" }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      type="submit"
                      fullWidth
                      disabled={loading || fetchingLoan}
                      sx={{
                        mt: 2,
                        ml: '30px',
                        py: 1.3,
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        background: 'linear-gradient(45deg, #0288d1, #26c6da)',
                        color: '#fff',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #0277bd, #00acc1)'
                        }
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Loan Entry'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Grid>

          <Grid item xs={12} md={7} sx={{ 
            width: "850px", 
            ml: { md: "50px", xs: 0 }, 
            height: "90vh",
          }}>
            <Paper elevation={3} sx={{ p: 2, height: "90vh", background: '#e6fbf9' }}>
              <LoanHistoryTable refreshTrigger={newLoanAdded} />
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
};

export default LoanEntryForm;
{/*import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import axios from 'axios';
import AdminSidebar from './Adminsidebar';
import LoanHistoryTable from './LoanHistryTable';

const LoanEntryForm = () => {
  const companyId = localStorage.getItem('companyId') || '';
  const [formData, setFormData] = useState({
    user: '',
    loanType: '',
    loanAmount: '',
    emiAmount: '',
    dueDate: '',
    paidDate: '',
    isAutoFilled: false
  });

  const [userNames, setUserNames] = useState([]);
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingLoan, setFetchingLoan] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const loanTypes = ['Home Loan', 'Car Loan', 'Personal Loan', 'Education Loan'];

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/loan/applicants', {
          params: { companyId }
        });
        const names = [...new Set(response.data.map(app => app.name))];
        setUserNames(names);
      } catch (err) {
        console.error('Error fetching applicants:', err);
        setError('Failed to load applicant data');
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [companyId]);

  useEffect(() => {
    const storedName = localStorage.getItem('companyName');
    if (storedName) setCompanyName(storedName);
  }, []);

  const handleUserChange = async (e) => {
    const selectedUserName = e.target.value.trim();
    setFormData(prev => ({
      ...prev,
      user: selectedUserName,
      isAutoFilled: false
    }));

    if (!selectedUserName) return;

    setFetchingLoan(true);
    setError(null);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/loan/applicant-loan/${companyId}/${encodeURIComponent(selectedUserName)}`
      );

      if (response.data?.success && response.data.data) {
        const { loanType, loanAmount } = response.data.data;

        const normalizedLoanType = loanTypes.find(type =>
          type.toLowerCase() === loanType?.toLowerCase()
        ) || '';

        setFormData(prev => ({
          ...prev,
          loanType: normalizedLoanType,
          loanAmount: loanAmount || '',
          isAutoFilled: !!normalizedLoanType
        }));

        if (!normalizedLoanType) {
          setError(`Loan type '${loanType}' not found in dropdown`);
        }
      } else {
        setError(response.data?.message || 'No loan data found');
      }
    } catch (err) {
      console.error('Error fetching loan details:', err);
      setError('Failed to fetch loan details');
    } finally {
      setFetchingLoan(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'loanType' || name === 'loanAmount' ? { isAutoFilled: false } : {})
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (!formData.user || !formData.loanType || !formData.loanAmount ||
        !formData.emiAmount || !formData.dueDate) {
        throw new Error('Please fill all required fields');
      }

      const payload = {
        ...formData,
        companyId,
        dueDate: new Date(formData.dueDate).toISOString(),
        paidDate: formData.paidDate ? new Date(formData.paidDate).toISOString() : null
      };

      const response = await axios.post('http://localhost:5000/api/loan-entries/entries', payload);

      if (response.data.success) {
        setSuccess('Loan entry saved successfully!');
        setFormData({
          user: '',
          loanType: '',
          loanAmount: '',
          emiAmount: '',
          dueDate: '',
          paidDate: '',
          isAutoFilled: false
        });
      } else {
        throw new Error(response.data.message || 'Failed to save loan entry');
      }
    } catch (err) {
      console.error('Error saving loan entry:', err);
      setError(err.response?.data?.message || err.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <><Box sx={{          height:"100vh",  backgroundImage: 'linear-gradient(to bottom right, #cdebf3ff, #aae3f0ff)',
}}>
  <AdminSidebar />
<Box sx={{ display: 'flex', mt: {md:3 ,xs:0}, }}>
  <Grid container spacing={4} alignItems="flex-start" sx={{ width: '100%', px: {md:4,xs:0}, display: 'flex' }}>
    <Grid item xs={12} md={5}  sx={{width:"400px",ml:{md:'120px',xs:0,mr:{md:0,xs:2}}}}>
      <Box
        p={4}
        borderRadius={3}
        sx={{
        background:'#e6fbf9',
          border: '1px solid #b2ebf2',
          width:"300px",ml:{md:"100px",xs:0}
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{ mb: 1, fontWeight: 600, color: '#0288d1' }}
        >
          {companyName ? `Loan Entry for - ${companyName}` : 'Loading Company...'}
        </Typography>

        <Typography
          variant="subtitle1"
          align="center"
          sx={{ mb: 3, color: '#555' }}
        >
          Fill in the details below
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="User Name"
                name="user"
                value={formData.user}
                onChange={handleUserChange}
                fullWidth
                required
                select
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 ,width:"300px"}}
              >
                {loading ? (
                  <MenuItem>Loading users...</MenuItem>
                ) : (
                  userNames.map((name, idx) => (
                    <MenuItem key={idx} value={name}>{name}</MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Loan Type"
                name="loanType"
                value={formData.loanType}
                onChange={handleChange}
                select
                fullWidth
                required
                disabled={fetchingLoan}
                sx={{ backgroundColor: '#ffffff', borderRadius: 1,width:"300px" }}
              >
                <MenuItem value="" disabled>Select loan type</MenuItem>
                {loanTypes.map((type) => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Loan Amount"
                name="loanAmount"
                value={formData.loanAmount}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                disabled={fetchingLoan}
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 ,width:"300px"}}
                InputProps={{
                  endAdornment: fetchingLoan ? <CircularProgress size={20} /> : null
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Monthly EMI Amount"
                name="emiAmount"
                value={formData.emiAmount}
                onChange={handleChange}
                type="number"
                fullWidth
                required
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 ,width:"300px"}}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Due Date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 ,width:"300px"}}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Paid Date"
                name="paidDate"
                value={formData.paidDate}
                onChange={handleChange}
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                sx={{ backgroundColor: '#ffffff', borderRadius: 1 ,width:"300px"}}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading || fetchingLoan}
                sx={{
                  mt: 2,
                  ml:'30px',
                  py: 1.3,
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  background: 'linear-gradient(45deg, #0288d1, #26c6da)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #0277bd, #00acc1)'
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Loan Entry'}
              </Button>
            </Grid>
          </Grid>
        </form>
      
      </Box>
    </Grid>

    <Grid item xs={12} md={7}  sx={{width:"850px",ml:{md:"50px",xs:0},height:"90vh",
}}>
      <Paper elevation={3} sx={{ p: 2,height:"90vh" ,background:'#e6fbf9'}}>
        <LoanHistoryTable />
      </Paper>
    </Grid>
  </Grid>
</Box>
  </Box>
    </>
  );
};

export default LoanEntryForm;*/}

