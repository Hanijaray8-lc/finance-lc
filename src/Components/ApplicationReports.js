import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer, Box, TableHead, TableRow, Paper, Button, Dialog,
  DialogTitle, DialogContent, Grid, Avatar, TextField, MenuItem,  DialogActions
} from '@mui/material';
import axios from 'axios';
import { FormControl, InputLabel, Select, } from '@mui/material';
import AdminSidebar from './Adminsidebar';
import { useNavigate } from "react-router-dom";
   import { useTheme } from '@mui/material/styles';
   import {  useMediaQuery } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const AdminLoanApplications = () => {
  const [applications, setApplications] = useState([]);
  const [financeCompanies, setFinanceCompanies] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedLoanType, setSelectedLoanType] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState('');
  const [companyName, setCompanyName] = useState('');
 const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [rejectMessage, setRejectMessage] = useState('');
    const navigate = useNavigate();


const fetchApplications = async () => {
  try {
   const companyId = localStorage.getItem('companyId');
const res = await axios.get(`http://localhost:5000/api/loan/company/${companyId}`);
setApplications(res.data);


  } catch (err) {
    console.error(err);
  }
};


const fetchFinanceCompanies = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/loan/finance-companies');
    setFinanceCompanies(res.data);
  } catch (err) {
    console.error('Failed to fetch finance companies', err);
  }
};

const fetchLoanTypes = async () => {
  try {
    const res = await axios.get('http://localhost:5000/api/loan/loan-types');
    setLoanTypes(res.data);
  } catch (err) {
    console.error('Failed to fetch loan types', err);
  }
};


 useEffect(() => {
  fetchApplications();
  fetchFinanceCompanies();
  fetchLoanTypes();

  // Load company name from localStorage
  const storedName = localStorage.getItem('companyName');
  if (storedName) setCompanyName(storedName);
}, []);


  

  const handleView = (app) => {
    setSelectedApp(app);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedApp(null);
  };

  const handleApprove = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/loan/updateStatus/${id}`, { 
        status: 'Approved',
        message: 'Congratulations! Your loan application has been approved.'
      });
      alert("Application Approved and email sent");
      fetchApplications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectClick = (id) => {
    setRejectId(id);
    setRejectOpen(true);
  };

  const handleRejectConfirm = async () => {
    try {
      await axios.put(`http://localhost:5000/api/loan/updateStatus/${rejectId}`, { 
        status: 'Rejected',
        message: rejectMessage 
      });
      alert("Application Rejected and email sent");
      fetchApplications();
      setRejectOpen(false);
      setRejectMessage('');
    } catch (err) {
      console.error(err);
    }
  };



  // Filtered applications based on search, company, and loan type
  const filteredApps = applications.filter(app =>
    (app.name.toLowerCase().includes(search.toLowerCase()) ||
    (app.FinancecompanyName && app.FinancecompanyName.toLowerCase().includes(search.toLowerCase())) ||
    app.loanType.toLowerCase().includes(search.toLowerCase())) &&
    (selectedCompany ? app.FinancecompanyName === selectedCompany : true) &&
    (selectedLoanType ? app.loanType === selectedLoanType : true)
  );

const FinancecompanyName = localStorage.getItem('companyName');
   const handleBack = () => {
    navigate(-1); // go back to previous page
  };

const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (<>
    <AdminSidebar/>
    <Box sx={{ backgroundColor: '#cdebf3ff', minHeight: "100vh",width:"100%",p:1 }}>
      <Box sx={{marginLeft:{md:"242px",xs:0}}}>
<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    mb: 3,
    ml: { xs: 2, md: 0 },
    mr: { xs: 2, md: 0 },
  }}
>
  <Typography
    variant="h5"
    sx={{
      fontWeight: "bold",
      color: "#24c6ef",
      fontSize: { md: 28, xs: 16 },
    }}
  >
    Loan Applications — {companyName || "Loading..."}
  </Typography>

  {isMobile ? (
    <ArrowBackIcon
      onClick={handleBack}
      sx={{ cursor: "pointer", color: "#24c6efff" }}
    />
  ) : (
    <Button
      onClick={handleBack}
      sx={{
        color: "#24c6efff",
        fontWeight: "bold",
        textTransform: "none",
        fontSize: { md: 16, xs: 14 },
        mr:{md:2}
      }}
      variant="outlined"
    >
      Back
    </Button>
  )}
</Box>



{/* Search & Filters */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
       <TextField
  variant="outlined"
  placeholder="Search by Name, Company, or Loan Type"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  sx={{
    backgroundColor: 'white',
    flex: 1,
    minWidth: { md: '220px', xs: '130px' },
    '& input::placeholder': {
      fontSize: { xs: '0.6rem', md: '0.875rem' }, // ✅ responsive placeholder font size
    },
  }}
/>



<FormControl sx={{ minWidth: {md:180, xs:160},backgroundColor: 'white' }}>
  <InputLabel id="loan-type-label" sx={{      fontSize: { xs: '0.6rem', md: '0.875rem' },mt:{xs:1,md:0} // ✅ responsive placeholder font size
}}>Find Loan Types</InputLabel>
  <Select
    labelId="loan-type-label"
    value={selectedLoanType}
    label="Find Loan Types"
    onChange={(e) => setSelectedLoanType(e.target.value)}
  >
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    {loanTypes.map((type, index) => (
      <MenuItem key={index} value={type}>
        {type}
      </MenuItem>
    ))}
  </Select>
</FormControl>
</Box><TableContainer
  component={Paper}
  sx={{
    maxHeight: 590,   // set the height (adjust px as you need)
    overflowY: "auto" // enable vertical scroll bar
  }}
>
  <Table size="small" sx={{p: { xs: '4px', md: '12px' }}}>

    <TableHead sx={{ backgroundColor: '#24c6ef' }}>
      <TableRow>
        {[
          "Photo",
          "Name",
          "Phone",
          "Loan Type",
          "Amount",
          "View",
          "Calculate Emi",
          "Approve",
          "Reject"
        ].map((header, index) => (
          <TableCell
            key={index}
            sx={{
              fontWeight: 'bold',
              color: 'white',
              fontSize: { xs: '0.6rem', md: '0.875rem' },
              p: { xs: '4px', md: '12px' } // ✅ reduce padding in mobile
            }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody sx={{ background: '#e6fbf9' }}>
      {filteredApps.map((app) => (
        <TableRow
          key={app._id}
          sx={{ fontSize: { xs: '0.6rem', md: '0.875rem' } }}
        >
          <TableCell sx={{ p: { xs: '4px', md: '12px' } }}>
            <Avatar
              src={`http://localhost:5000/uploads/${app.photo}`}
              alt="User Photo"
              sx={{ width: 32, height: 32 }} // ✅ smaller avatar on mobile
            />
          </TableCell>
          <TableCell sx={{ fontSize: { xs: '0.6rem', md: '0.875rem' }, p: { xs: '4px', md: '12px' } }}>
            {app.name}
          </TableCell>
          <TableCell sx={{ fontSize: { xs: '0.6rem', md: '0.875rem' }, p: { xs: '4px', md: '12px' } }}>
            {app.phone}
          </TableCell>
          <TableCell sx={{ fontSize: { xs: '0.6rem', md: '0.875rem' }, p: { xs: '4px', md: '12px' } }}>
            {app.loanType}
          </TableCell>
          <TableCell sx={{ fontSize: { xs: '0.6rem', md: '0.875rem' }, p: { xs: '4px', md: '12px' } }}>
            ₹{app.loanAmount}
          </TableCell>
          <TableCell sx={{ p: { xs: '4px', md: '12px' } }}>
            <Button
              variant="outlined"
              onClick={() => handleView(app)}
              sx={{ fontSize: { xs: '0.6rem', md: '0.875rem' }, minWidth: { xs: 50, md: 80 } }}
            >
              View
            </Button>
          </TableCell>
          <TableCell sx={{ p: { xs: '4px', md: '12px' } }}>
            <Button
              onClick={() => {
                localStorage.setItem("emiApp", JSON.stringify(app));
                window.location.href = "/CalculateEmi";
              }}
              variant="contained"
              sx={{
                m: 1,
                backgroundColor: 'green',
                color: 'white',
                fontSize: { xs: '0.6rem', md: '0.875rem' },
                minWidth: { xs: 90, md: 160 }
              }}
            >
              Calculate EMI
            </Button>
          </TableCell>
          <TableCell sx={{ p: { xs: '4px', md: '12px' } }}>
            <Button
              variant="contained"
              color="success"
              onClick={() => handleApprove(app._id)}
              disabled={app.status === 'Approved'}
              sx={{ fontSize: { xs: '0.6rem', md: '0.875rem' }, minWidth: { xs: 60, md: 90 } }}
            >
              Approve
            </Button>
          </TableCell>
          <TableCell sx={{ p: { xs: '4px', md: '12px' } }}>
  <Button
    variant="contained"
    color="error"
    onClick={() => handleRejectClick(app._id)}
    disabled={app.status === 'Rejected'}
    sx={{ fontSize: { xs: '0.6rem', md: '0.875rem' }, minWidth: { xs: 60, md: 90 } }}
  >
    Reject
  </Button>

  <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)}>
    <DialogTitle>Reject Application</DialogTitle>
    <DialogContent>
      <TextField
        autoFocus
        margin="dense"
        label="Rejection Reason"
        type="text"
        fullWidth
        variant="standard"
        value={rejectMessage}
        onChange={(e) => setRejectMessage(e.target.value)}
        multiline
        rows={3}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={() => setRejectOpen(false)}>Cancel</Button>
      <Button onClick={handleRejectConfirm} color="error">Confirm Reject</Button>
    </DialogActions>
  </Dialog>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer>


        {/* Popup Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth={false}
          sx={{ '& .MuiDialog-paper': { width: '520px', maxWidth: '95%' } }}
        >
          <DialogTitle sx={{ backgroundColor: '#24c6ef', textAlign: "center", color: "white", fontWeight: "bold" }}>
            User Application Details
          </DialogTitle>
          <DialogContent dividers sx={{ backgroundColor:'#e6fbf9' }}>
            {selectedApp && (
              <Grid container spacing={2}>
              {Object.entries(selectedApp).map(([key, value]) => (
  key !== '__v' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'financeCompanyName' && key !== 'companyId' && (
    <Grid item xs={12} sm={6} key={key}>
      <Box sx={{ display: 'flex', flexDirection: 'column', p: 1, borderRadius: 1, bgcolor: '#f9f9f9' }}>
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 'bold', textTransform: 'capitalize', mb: 0.5, width: "200px" }}
        >
          {key.replace(/([A-Z])/g, ' $1')}:
        </Typography>

        {['idProof', 'addressProof', 'incomeProof', 'photo'].includes(key) && value ? (
          <Button
            variant="outlined"
            href={`http://localhost:5000/uploads/${value}`}
            target="_blank"
            rel="noreferrer"
            sx={{ textTransform: 'none', mt: 1, width: 'fit-content' }}
          >
            {key === 'photo' ? 'View Photo' : `View ${key}`}
          </Button>
        ) : (
          <Typography variant="body2" sx={{ wordWrap: 'break-word' }}>
            {value}
          </Typography>
        )}
      </Box>
    </Grid>
  )
))}
</Grid>
            )}
          </DialogContent>
          <Button onClick={handleClose} sx={{ m: 2, backgroundColor: '#24c6ef' }} variant="contained">Close</Button>
        </Dialog>
      </Box>
    </Box>
    </>
  );
};

export default AdminLoanApplications;

