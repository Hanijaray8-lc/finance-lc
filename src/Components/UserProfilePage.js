import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Button,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import dayjs from 'dayjs';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loanData, setLoanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/userprofile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log('API Response:', res.data);
        
        setUserData(res.data.user);
        setLoanData(res.data.loan || null);
        setError(null);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.response?.data?.message || 'Failed to fetch profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  const formatDate = (dateString) => {
    return dateString ? dayjs(dateString).format('DD/MM/YYYY') : 'N/A';
  };

  const formatCurrency = (amount) => {
    return amount ? `₹${Number(amount).toLocaleString('en-IN')}` : 'N/A';
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress size={80} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column'
      }}>
        <Typography color="error" variant="h6" sx={{ mb: 2 }}>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ p:2, backgroundColor: '#cdebf3ff', minHeight: '90vh' }}>
      

        <Paper
          elevation={4}
          sx={{
            maxWidth: 1250,
            mx: 'auto',
            p:{md:4,xs:2} ,
            borderRadius: 4,
            background: '#e6fbf9' 
          }}
        >  
       
          <Grid container spacing={4}>
            <Grid item xs={12} md={4} sx={{ width: '500px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <Box 
  sx={{ 
    display: "flex", 
    justifyContent: "space-between", 
    alignItems: "center", 
    mb: 1,
    gap:{md:20,xs:7}
  }}
>
  {/* Left: Heading */}
  <Typography
    variant="h4"
    sx={{ fontWeight: 'bold', fontSize:{ xs:15 ,md:25}, color: '#24c6efff' }}
  >
    👤 User Profile
  </Typography>

  {/* Right: Edit Profile button */}
  <Button
    variant="outlined"
    sx={{ color: 'white', background:'#24c6efff' ,fontSize:{md:12,xs:10}}}
    onClick={() => navigate('/EditUserProfile')}
  >
    ✏️ Edit Profile
  </Button>
</Box>

          <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2, // space between image and text
    p: 2,
    border: "1px solid #ddd",
    borderRadius: 2,
    backgroundColor: "#f9f9f9",
    width: {md:"450px",xs:"260px"}
  }}
>
  {/* Left: Avatar */}
  <Avatar
    src={
      loanData?.photo
        ? `http://localhost:5000/uploads/${loanData.photo}`
        : userData?.profilePhoto
        ? `http://localhost:5000/uploads/${userData.profilePhoto}`
        : ""
    }
    sx={{
      width: 80,
      height: 80,
      bgcolor: "primary.main",
    }}
  >
    {userData?.name?.charAt(0)?.toUpperCase() || "U"}
  </Avatar>

  {/* Right: Name + Email */}
  <Box>
    <Typography variant="h6">{userData.name}</Typography>
    <Typography variant="body2" color="text.secondary">
      {userData.email}
    </Typography>
  </Box>
</Box>

                 <Grid container spacing={2} sx={{ mt: 2,}}>
                  {[
                    { label: 'Photo', key: 'photo' },
                    { label: 'ID Proof', key: 'idProof' },
                    { label: 'Address Proof', key: 'addressProof' },
                    { label: 'Income Proof', key: 'incomeProof' },
                  ].map((doc, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Box
                        sx={{
                          border: '1px solid #ccc',
                          borderRadius: 2,
                          p: 2,
                          backgroundColor: '#f9f9f9',
                          textAlign: 'center',
                          width: {md:'200px',xs:"260px"},
                          height: '170px',
                        }}
                      >
                        <Typography variant="subtitle1" gutterBottom>
                          {doc.label}
                        </Typography>
                        {loanData?.[doc.key] ? (
                          <img
                            src={`http://localhost:5000/uploads/${loanData[doc.key]}`}
                            alt={doc.label}
                            style={{
                              width: '100%',
                              height: 140,
                              objectFit: 'cover',
                              borderRadius: 8,
                            }}
                          />
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Not uploaded
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                </Grid>
</Box>
            </Grid>

            <Grid item xs={12} md={8} sx={{ width: '700px' }}>
              {loanData ? (
                <>
           <Box 
  sx={{ 
    display: {md:"flex",},
    alignItems: "center", 
    mb: 2 ,
    gap:{md:10,xs:2}
  }}
>
  {/* Left: Heading */}
  <Typography variant="h6" sx={{ color: '#24c6efff',fontSize:{md:20,xs:15} }}>
    💰 Loan Application Details
  </Typography>

  {/* Right: Buttons */}
<Box
  sx={{
    display: "flex",
    gap: 1,
    flexDirection: { xs: "column", md: "row" }, // 👈 mobile la column, desktop la row
    alignItems: { xs: "stretch", md: "center" }, // mobile la full width
  }}
>
  <Button
    variant="contained"
    sx={{
      backgroundColor: "#24c6efff",
      color: "white",
      "&:hover": { backgroundColor: "#1faed1" },
    }}
    onClick={() => navigate("/TrackHistory")}
  >
    📜 My History
  </Button>

<Button
  variant="contained"
  sx={{
    backgroundColor: "#24c6efff",
    color: "white",
    "&:hover": { backgroundColor: "#1faed1" },
  }}
  onClick={() => navigate("/ApplicationForm", { state: { loanData } })}
>
  ✏️ Edit Loan Details
</Button>
</Box>

</Box>


                  <Grid container spacing={2}>
                    {[
                      { label: 'Name', value: loanData.name },
                      { label: 'Father/Husband Name', value: loanData.fatherOrHusbandName },
                      { label: 'DOB', value: new Date(loanData.dob).toLocaleDateString() },
                      { label: 'Marital Status', value: loanData.maritalStatus },
                      { label: 'Phone', value: loanData.phone },
                      { label: 'Email', value: userData.email },
                      { label: 'Address', value: loanData.address },
                      { label: 'Employment Type', value: loanData.employmentType },
                      { label: 'Company Name', value: loanData.companyName },
                      { label: 'Company Address', value: loanData.companyAddress },
                      { label: 'Monthly Income', value: `₹${loanData.monthlyIncome}` },
                      { label: 'Loan Amount', value: `₹${loanData.loanAmount}` },
                      { label: 'Loan Type', value: loanData.loanType },
                      { label: 'Loan Tenure', value: `${loanData.loanTenure} years` },
                      { label: 'Existing Loans', value: loanData.existingLoans },
                      { label: 'CIBIL Score', value: loanData.cibilScore },
                      { label: 'EMI/NMI Ratio', value: loanData.emiNmiRatio },
                      { label: 'Finance Company', value: loanData.FinancecompanyName },
                    ].map((item, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box
                          sx={{
                            border: '1px solid #ccc',
                            borderRadius: 2,
                            p: 2,
                            backgroundColor: '#f9f9f9',
                            width: {md:'300px',xs:'250px'},
                            height: '13px',
                          }}
                        >
                          <Typography variant="body1">
                            <strong>{item.label}:</strong> {item.value}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    You have not applied for any loan yet.
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2, backgroundColor: '#24c6efff', textTransform: 'none' }}
                    onClick={() => navigate('/ApplyLoan')}
                  >
                    🚀 Apply for a Loan
                  </Button>
                </Box>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default UserProfilePage;

