import React, { useState, useEffect } from 'react';
import { 
  Container, TextField, Button, Typography, Box, MenuItem, Grid, 
  InputAdornment, useMediaQuery, useTheme, Paper
} from '@mui/material';
import axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const LoanApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  

  const handleBack = () => {
    navigate(-1); // go back to previous page
  };
  
  // Get data passed from both pages - companyId-யும் include பண்ணுங்கள்
  const selectedFinanceCompanyName = location.state?.FinancecompanyName || '';
  const companyId = location.state?.companyId || '';
  
  // Auto-filled from ProductDetailsPage (will be empty if coming from FinanceCompaniesPage)
  const autoFilledLoanType = location.state?.loanType || '';
  const autoFilledLoanTenure = location.state?.loanTenure || '';
  
  // Get existing loan data if in edit mode
  const existingLoanData = location.state?.loanData || null;

  // Check if manual selection is needed
  const needsManualSelection = !autoFilledLoanType && !autoFilledLoanTenure && !existingLoanData;

  const [formData, setFormData] = useState({
    name: '',
    fatherOrHusbandName: '',
    dob: '',
    maritalStatus: '',
    address: '',
    phone: '',
    email: '',
    employmentType: '',
    companyName: '',
    companyAddress: '',
    monthlyIncome: '',
    loanAmount: '',
    loanType: autoFilledLoanType,
    loanTenure: autoFilledLoanTenure,
    existingLoans: '',
    cibilScore: '',
    emiNmiRatio: '',
    FinancecompanyName: selectedFinanceCompanyName,
    companyId: companyId, // இப்போது auto-fetch ஆகும்
    idProof: null,
    addressProof: null,
    incomeProof: null,
    photo: null
  });

  // State for file names and selection status
  const [fileStates, setFileStates] = useState({
    idProof: { fileName: '', isSelected: false },
    addressProof: { fileName: '', isSelected: false },
    incomeProof: { fileName: '', isSelected: false },
    photo: { fileName: '', isSelected: false }
  });

  const [isEditMode, setIsEditMode] = useState(false);

  // Loan options for manual selection
  const loanTypeOptions = [
    'Personal Loan', 'Home Loan', 'Car Loan', 'Business Loan', 
    'Education Loan', 'Gold Loan', 'Loan Against Property', 'Agriculture Loan'
  ];
  
  const loanTenureOptions = [
    '1', '2', '3','4', '5','6', '7', '8','9','10',
    '11','12','13','14', '15','16','17','18','19', '20', 
   
  ];

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Pre-fill the form when existing loan data is available
  useEffect(() => {
    if (existingLoanData) {
      setIsEditMode(true);
      setFormData({
        name: existingLoanData.name || '',
        fatherOrHusbandName: existingLoanData.fatherOrHusbandName || '',
        dob: formatDateForInput(existingLoanData.dob) || '', 
        maritalStatus: existingLoanData.maritalStatus || '',
        address: existingLoanData.address || '',
        phone: existingLoanData.phone || '',
        email: existingLoanData.email || '',
        employmentType: existingLoanData.employmentType || '',
        companyName: existingLoanData.companyName || '',
        companyAddress: existingLoanData.companyAddress || '',
        monthlyIncome: existingLoanData.monthlyIncome || '',
        loanAmount: existingLoanData.loanAmount || '',
        loanType: existingLoanData.loanType || autoFilledLoanType,
        loanTenure: existingLoanData.loanTenure || autoFilledLoanTenure,
        existingLoans: existingLoanData.existingLoans || '',
        cibilScore: existingLoanData.cibilScore || '',
        emiNmiRatio: existingLoanData.emiNmiRatio || '',
        FinancecompanyName: existingLoanData.FinancecompanyName || selectedFinanceCompanyName,
        companyId: existingLoanData.companyId || companyId,
        idProof: null,
        addressProof: null,
        incomeProof: null,
        photo: null
      });

      // Set file names for existing files in edit mode
      if (existingLoanData.idProof) {
        setFileStates(prev => ({
          ...prev,
          idProof: { fileName: 'Existing ID Proof', isSelected: true }
        }));
      }
      if (existingLoanData.addressProof) {
        setFileStates(prev => ({
          ...prev,
          addressProof: { fileName: 'Existing Address Proof', isSelected: true }
        }));
      }
      if (existingLoanData.incomeProof) {
        setFileStates(prev => ({
          ...prev,
          incomeProof: { fileName: 'Existing Income Proof', isSelected: true }
        }));
      }
      if (existingLoanData.photo) {
        setFileStates(prev => ({
          ...prev,
          photo: { fileName: 'Existing Photo', isSelected: true }
        }));
      }
    } else {
      // Set companyId from location state for new applications
      setFormData(prev => ({
        ...prev,
        companyId: companyId,
        FinancecompanyName: selectedFinanceCompanyName
      }));
    }
  }, [existingLoanData, selectedFinanceCompanyName, companyId, autoFilledLoanType, autoFilledLoanTenure]);

  const maritalOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  const employmentOptions = ['Salaried', 'Self-employed', 'Farmer', 'Other'];

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      
      // Update file state with file name and selection status
      setFileStates(prev => ({
        ...prev,
        [name]: { 
          fileName: files[0].name, 
          isSelected: true 
        }
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate loan details
    if (!formData.loanType || !formData.loanTenure) {
      alert('Please select loan type and tenure');
      return;
    }

    // Validate companyId is present
    if (!formData.companyId) {
      alert('Company ID is required');
      return;
    }

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        form.append(key, value);
      }
    });

    try {
      const endpoint = isEditMode 
        ? 'http://localhost:5000/api/loan/update' 
        : 'http://localhost:5000/api/loan/apply';
      
      const res = await axios.post(endpoint, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      alert(res.data.message || (isEditMode ? "Application updated successfully" : "Application submitted successfully"));

      if (!isEditMode) {
        setFormData({
          name: '',
          fatherOrHusbandName: '',
          dob: '',
          maritalStatus: '',
          address: '',
          phone: '',
          email: '',
          employmentType: '',
          companyName: '',
          companyAddress: '',
          monthlyIncome: '',
          loanAmount: '',
          loanType: autoFilledLoanType,
          loanTenure: autoFilledLoanTenure,
          existingLoans: '',
          cibilScore: '',
          emiNmiRatio: '',
          FinancecompanyName: selectedFinanceCompanyName,
          companyId: companyId,
          idProof: null,
          addressProof: null,
          incomeProof: null,
          photo: null
        });

        // Reset file states
        setFileStates({
          idProof: { fileName: '', isSelected: false },
          addressProof: { fileName: '', isSelected: false },
          incomeProof: { fileName: '', isSelected: false },
          photo: { fileName: '', isSelected: false }
        });
      } else {
        navigate('/UserProfilePage');
      }
    } catch (err) {
      console.error(err);
      alert(isEditMode ? "Update failed" : "Submission failed");
    }
  };

  // Function to render file upload button with dynamic styling
  const renderFileUploadButton = (name, label, accept = "") => {
    const fileState = fileStates[name];

    
    return (
      <Box>
        <Button 
          fullWidth
          variant="outlined" 
          component="label"
          startIcon={<CloudUploadIcon />}
          sx={{ 
            textTransform: 'none',
            minWidth: { xs: 1, sm: name === 'idProof' || name === 'addressProof' ? 220 : 200 },
            height: 100,
            fontSize: { xs: '0.8rem', sm: '1rem' },
            padding: '12px 24px',
            backgroundColor: fileState.isSelected ? '#e8f5e9' : 'white',
            borderColor: fileState.isSelected ? '#24c6efff' : 'rgba(0, 0, 0, 0.23)',
            color: fileState.isSelected ?  '#24c6efff' : 'inherit',
            width: { 
              md: name === 'idProof' || name === 'addressProof' ? '200px' : 
                  name === 'incomeProof' ? '225px' : '210px', 
              xs: '300px' 
            },
            '&:hover': {
              borderColor: fileState.isSelected ?  '#24c6efff' : 'rgba(0, 0, 0, 0.87)',
              backgroundColor: fileState.isSelected ? '#c8e6c9' : '#f5f5f5'
            }
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <span>{label}</span>
            {fileState.fileName && (
              <Typography 
                variant="caption" 
                sx={{ 
                  mt: 0.5, 
                  fontStyle: 'italic',
                  color: fileState.isSelected ? '#24c6efff' : '#666',
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {fileState.fileName}
              </Typography>
            )}
          </Box>
          <input 
            type="file" 
            name={name} 
            hidden 
            onChange={handleFileChange} 
            required={!isEditMode}
            accept={accept}
          />
        </Button>
      </Box>
    );
  };

  return (
    <>
      <Navbar/>
      
      <Box sx={{backgroundColor: '#c2eff3ff', minHeight: {md:'85vh',xs:"120vh"},width:{md:"99%",xs:"343px"} ,p: {md:'10px',xs:1}}}>
        <Container maxWidth="810px" sx={{backgroundColor: '#e6fbf9', padding: '20px',pr:{md:0,xs:3}}}>
          <Box>
        
<Box 
      display="flex" 
      alignItems="center" 
      sx={{ mb: 2 ,gap:{md:120,xs:2}}}
    >
    

      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{
          color: "#24c6efff",
          fontWeight: "bold",
          letterSpacing: 1,
          textTransform: "uppercase",
          fontSize: { xs: "0.8rem", md: "1.5rem" },
        }}
      >
        {isEditMode ? "Update Loan Application" : "Loan Application Form"}
      </Typography>

        <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={handleBack} 
        sx={{ color: "white",background:"#24c6efff", fontWeight: "bold", }}
      >
        Back
      </Button>
    </Box>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 4, md: 10 }
              }}>
                <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <img 
                    src='./Images/applyloan1.png' 
                    alt='applyloan' 
                    style={{
                      marginTop: 2,
                      width: '100%',
                      height: 'auto',
                      maxWidth: {md:460,xs:290},
                      maxHeight: 230
                    }}
                  />                  
                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                      {renderFileUploadButton('idProof', 'Upload ID Proof')}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderFileUploadButton('addressProof', 'Upload Address Proof')}
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                      {renderFileUploadButton('incomeProof', 'Upload Income Proof', '.pdf,.jpg,.png')}
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      {renderFileUploadButton('photo', 'Upload Photo', '.jpg,.jpeg,.png')}
                    </Grid>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} sx={{ mt: {md:2 ,xs:0}}}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Finance Company Name"
                      name="FinancecompanyName"
                      value={formData.FinancecompanyName}
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ 
                        minWidth: { xs: 1, sm: 410 },
                        maxWidth: { xs: 1, sm: 450 },
                        backgroundColor: "white" 
                      }}
                    />
                  </Grid>
                </Box>

                <Box sx={{ width: { xs: '100%', md: 'auto' } }}>
                  <Grid container spacing={{ xs: 0, sm: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Father/Husband Name" 
                        name="fatherOrHusbandName" 
                        value={formData.fatherOrHusbandName} 
                        onChange={handleChange} 
                        required 
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Date of Birth" 
                        name="dob" 
                        type="date" 
                        InputLabelProps={{ shrink: true }} 
                        value={formData.dob} 
                        onChange={handleChange} 
                        required 
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={{ xs: 0, sm: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Marital Status"
                        name="maritalStatus"
                        value={formData.maritalStatus}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      >
                        {maritalOptions.map(status => (
                          <MenuItem key={status} value={status}>{status}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        select
                        fullWidth
                        margin="normal"
                        label="Employment Type"
                        name="employmentType"
                        value={formData.employmentType}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      >
                        {employmentOptions.map(type => (
                          <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Grid container spacing={{ xs: 0, sm: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Company Name"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Company Address"
                        name="companyAddress"
                        value={formData.companyAddress}
                        onChange={handleChange}
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Monthly Income"
                        name="monthlyIncome"
                        type="number"
                        value={formData.monthlyIncome}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                          inputProps: { min: 0 }
                        }}
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={{ xs: 0, sm: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField 
                        fullWidth
                        margin="normal"
                        label="Loan Amount"
                        name="loanAmount"
                        type="number"
                        value={formData.loanAmount}
                        onChange={handleChange}
                        required
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      {needsManualSelection ? (
                        <TextField
                          select
                          fullWidth
                          margin="normal"
                          label="Loan Type *"
                          name="loanType"
                          value={formData.loanType}
                          onChange={handleChange}
                          required
                          sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                        >
                          {loanTypeOptions.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Loan Type"
                          name="loanType"
                          value={formData.loanType}
                          InputProps={{
                            readOnly: true,
                          }}
                          sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                        />
                      )}
                    </Grid>
                    
                    <Grid item xs={12} sm={6} md={4}>
                      {needsManualSelection ? (
                        <TextField
                          select
                          fullWidth
                          margin="normal"
                          label="Loan Tenure *"
                          name="loanTenure"
                          value={formData.loanTenure}
                          onChange={handleChange}
                          required
                          sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                        >
                          {loanTenureOptions.map(tenure => (
                            <MenuItem key={tenure} value={tenure}>{tenure} Years</MenuItem>
                          ))}
                        </TextField>
                      ) : (
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Loan Tenure (in years)"
                          name="loanTenure"
                          value={formData.loanTenure}
                          InputProps={{
                            endAdornment: <InputAdornment position="end">years</InputAdornment>,
                            readOnly: true,
                          }}
                          sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                        />
                      )}
                    </Grid>
                  </Grid>
                  
                  <Grid container spacing={{ xs: 0, sm: 2 }}>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField 
                        fullWidth 
                        margin="normal" 
                        label="Existing Loans (if any)" 
                        name="existingLoans" 
                        value={formData.existingLoans} 
                        onChange={handleChange}
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField 
                        fullWidth 
                        margin="normal" 
                        label="CIBIL Score" 
                        name="cibilScore" 
                        type="number" 
                        value={formData.cibilScore} 
                        onChange={handleChange} 
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField 
                        fullWidth 
                        margin="normal" 
                        label="EMI/NMI Ratio" 
                        name="emiNmiRatio" 
                        type="number" 
                        value={formData.emiNmiRatio} 
                        onChange={handleChange} 
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={{ xs: 0, sm: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputProps={{
                          inputProps: {
                            pattern: "[0-9]{10}",
                            title: "Please enter a 10-digit phone number"
                          }
                        }}
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        margin="normal"
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        InputProps={{
                          inputProps: {
                            pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$",
                            title: "Please enter a valid email address"
                          }
                        }}
                        sx={{backgroundColor:"white",minWidth:{md:'270px',xs:"300px"}}}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Company ID"
                        name="companyId"
                        value={formData.companyId}
                        InputProps={{
                          readOnly: true, // Auto-filled, user can't edit
                        }}
                        sx={{backgroundColor:"white", mt: 2,minWidth:{md:'270px',xs:"300px"}}}
                        required
                      />
                    </Grid>
                    
                  </Grid> 
                  
                  <Button 
                    fullWidth 
                    variant="contained" 
                    sx={{ 
                      backgroundColor: '#24c6efff', 
                      width: { xs: '100%', md: '300px' }, 
                      ml: { xs: 0, md: "270px" }, 
                      mt: 2
                    }} 
                    type="submit"
                  >
                    {isEditMode ? 'Update Application' : 'Submit Application'}
                  </Button>
                </Box>
              </Box>
            </form>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoanApplicationForm;
