import React, { useState } from 'react';
import {
  TextField, Button, Typography, Box, Grid, InputAdornment, Paper, Avatar
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import ApprovedCompanies from './ApprovedCompanies';

const RegisterFinanceCompany = () => {
  const [companyData, setCompanyData] = useState({
    firstName: '',
    password: '',
    name: '',
    companyId: '',
    description: '',
    logo: '',
    details: '',
    contactNumber: '',
    email: '',
    website: '',
    branch: '',
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [existingLogo, setExistingLogo] = useState('');
  const [currentLogoPreview, setCurrentLogoPreview] = useState('');
  
  // ✅ New state for refreshing approved companies list
  const [refreshApproved, setRefreshApproved] = useState(0);

  const handleChange = (e) => {
    setCompanyData({ ...companyData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setCompanyData({ ...companyData, logo: e.target.files[0] });
      setIsFileUploaded(true);
      setCurrentLogoPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    Object.entries(companyData).forEach(([key, value]) => {
      if (key === 'logo' && !value && existingLogo) {
        return;
      }
      formData.append(key, value);
    });

    if (isEditMode && !companyData.logo && existingLogo) {
      formData.append('existingLogo', existingLogo);
    }

    try {
      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/financeCompanies/${editId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Company updated successfully!');
        
        // ✅ Refresh the approved companies list after update
        setRefreshApproved(prev => prev + 1);
      } else {
        await axios.post('http://localhost:5000/api/financeCompanies', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Request send to Manager');
      }

      // Reset form
      setCompanyData({
        firstName: '',
        password: '',
        name: '',
        companyId: '',
        description: '',
        logo: '',
        details: '',
        contactNumber: '',
        email: '',
        website: '',
        branch: '',
      });
      setIsEditMode(false);
      setEditId(null);
      setIsFileUploaded(false);
      setExistingLogo('');
      setCurrentLogoPreview('');
    } catch (error) {
      console.error(error);
      alert('Failed to submit form.');
    }
  };

  const handleEditClick = (company) => {
    setCompanyData({
      firstName: company.firstName,
      password: '', // Always empty for security
      name: company.name,
      companyId: company.companyId,
      description: company.description,
      logo: '',
      details: company.details,
      contactNumber: company.contactNumber,
      email: company.email,
      website: company.website,
      branch: company.branch,
    });
    
    setEditId(company._id);
    setIsEditMode(true);
    setIsFileUploaded(false);
    setExistingLogo(company.logo);
    
    if (company.logo) {
      setCurrentLogoPreview(`http://localhost:5000/uploads/${company.logo}`);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f0f8ff', p: 4 }}>
      <Grid container spacing={3}>
        {/* Left side - Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor: '#e6fbf9', width: '420px' }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
              {isEditMode ? 'Update Finance Company' : 'Register Finance Company'}
            </Typography>
            
            {isEditMode && currentLogoPreview && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, flexDirection: 'column', alignItems: 'center' }}>
                <Avatar 
                  src={currentLogoPreview} 
                  sx={{ width: 80, height: 80, mb: 1 }}
                />
                <Typography variant="body2" sx={{ color: '#24c6ef', fontWeight: 'bold' }}>
                  Current Logo
                </Typography>
              </Box>
            )}
            
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField 
                    label="First Name" 
                    name="firstName" 
                    fullWidth 
                    required 
                    value={companyData.firstName} 
                    onChange={handleChange} 
                    sx={{ width: "200px" }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField 
                    label={isEditMode ? "Password (leave blank to keep current)" : "Password"} 
                    name="password" 
                    type="password" 
                    fullWidth 
                    required={!isEditMode}
                    value={companyData.password} 
                    onChange={handleChange} 
                    sx={{ width: "200px" }} 
                    placeholder={isEditMode ? "••••••••" : ""}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField 
                    label="Company Name" 
                    name="name" 
                    fullWidth 
                    required 
                    value={companyData.name} 
                    onChange={handleChange} 
                    sx={{ width: "200px" }} 
                    InputProps={{ startAdornment: (<InputAdornment position="start"><BusinessIcon /></InputAdornment>) }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField 
                    label="Company ID" 
                    name="companyId" 
                    fullWidth 
                    required 
                    value={companyData.companyId} 
                    onChange={handleChange} 
                    sx={{ width: "200px" }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField 
                    label="Contact Number" 
                    name="contactNumber" 
                    fullWidth 
                    required 
                    value={companyData.contactNumber} 
                    onChange={handleChange} 
                    sx={{ width: "200px" }} 
                    InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIcon /></InputAdornment>) }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField 
                    label="Email" 
                    name="email" 
                    fullWidth 
                    required 
                    value={companyData.email} 
                    onChange={handleChange} 
                    sx={{ width: "200px" }} 
                    InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField 
                    label="Website" 
                    name="website" 
                    fullWidth 
                    required 
                    value={companyData.website} 
                    onChange={handleChange} 
                    sx={{ width: "200px" }} 
                    InputProps={{ startAdornment: (<InputAdornment position="start"><LanguageIcon /></InputAdornment>) }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField 
                    label="Branch" 
                    name="branch" 
                    fullWidth 
                    required 
                    value={companyData.branch} 
                    onChange={handleChange} 
                    sx={{ width: "200px" }} 
                    InputProps={{ startAdornment: (<InputAdornment position="start"><LocationOnIcon /></InputAdornment>) }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField 
                    label="Description" 
                    name="description" 
                    fullWidth 
                    required 
                    multiline 
                    rows={2} 
                    value={companyData.description} 
                    onChange={handleChange} 
                    sx={{ width: "200px" }} 
                    InputProps={{ startAdornment: (<InputAdornment position="start"><DescriptionIcon /></InputAdornment>) }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField 
                    label="Details" 
                    name="details" 
                    fullWidth 
                    required 
                    multiline 
                    rows={2} 
                    value={companyData.details} 
                    onChange={handleChange} 
                    sx={{ width: "200px" }} 
                    InputProps={{ startAdornment: (<InputAdornment position="start"><DescriptionIcon /></InputAdornment>) }} 
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{
                      height: '60px',
                      width: "418px",
                      fontSize: '16px',
                      justifyContent: 'center',
                      borderColor: isFileUploaded ? '#4caf50' : '#1976d2',
                      backgroundColor: isFileUploaded ? '#e8f5e9' : 'transparent',
                      color: isFileUploaded ? '#2e7d32' : 'inherit',
                      '&:hover': {
                        borderColor: isFileUploaded ? '#388e3c' : '#1565c0',
                        backgroundColor: isFileUploaded ? '#c8e6c9' : 'rgba(25, 118, 210, 0.04)',
                      }
                    }}
                  >
                    {isFileUploaded ? (
                      <>
                        <CheckCircleIcon sx={{ mr: 1 }} />
                        {isEditMode ? 'New Logo Uploaded' : 'Logo Uploaded Successfully'}
                      </>
                    ) : (
                      isEditMode ? 'Upload New Logo' : 'Upload Logo'
                    )}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </Button>
                  
                  {isEditMode && existingLogo && !isFileUploaded && (
                    <Typography variant="caption" sx={{ display: 'block', mt: 1, textAlign: 'center', color: '#666' }}>
                      Current logo will be retained
                    </Typography>
                  )}
                </Grid>
                
                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: '#24c6ef', width: "200px" }}
                  >
                    {isEditMode ? 'Update Company' : 'Register Company'}
                  </Button>
                  
                  {isEditMode && (
                    <Button
                      variant="outlined"
                      sx={{ mt: 2, ml: 2, width: "100px" }}
                      onClick={() => {
                        setIsEditMode(false);
                        setEditId(null);
                        setCompanyData({
                          firstName: '',
                          password: '',
                          name: '',
                          companyId: '',
                          description: '',
                          logo: '',
                          details: '',
                          contactNumber: '',
                          email: '',
                          website: '',
                          branch: '',
                        });
                        setCurrentLogoPreview('');
                      }}
                    >
                      Cancel
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        {/* Right side - Approved Companies Table */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3, width: '910px', height: "83vh", background: '#e6fbf9' }}>
            {/* ✅ Pass refresh trigger as prop */}
            <ApprovedCompanies onEdit={handleEditClick} refreshTrigger={refreshApproved} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RegisterFinanceCompany;


