import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Paper,
  Chip
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const ProductDetailsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { companyName } = location.state || {};
  const [selectedCompany, setSelectedCompany] = useState(null);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:5000/api/products/${encodeURIComponent(companyName)}`
        );

        if (res.data.success) {
          setProducts(res.data.products);
        } else {
          setError(res.data.error || 'Failed to fetch products');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (companyName) {
      fetchProducts();
    }
  }, [companyName]);

  return (
    <>
      <Navbar />
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#cdebf3ff', minHeight: '100vh' }}>
  <Paper
    elevation={3}
    sx={{
      p: { xs: 2, md: 3 },
      borderRadius: 4,
      mb: 4,
      backgroundColor: '#e6fbf9',
      boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
    }}
  >
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#24c6ef' ,fontSize:{md:25,xs:15}}}>
        Loan Offers from {companyName}
      </Typography>
      <Button
        variant="contained"
        onClick={() => navigate(-1)}
        sx={{
          backgroundColor: '#24c6ef',
          color: '#fff',
          fontWeight: 'bold',
          px: 3,
          py: 1,
          borderRadius: 2,
          '&:hover': { backgroundColor: '#1ca9cc' },
        }}
      >
        ← Back
      </Button>
    </Box>
  </Paper>

  {loading ? (
    <Box sx={{ textAlign: 'center', mt: 5 }}>
      <CircularProgress />
    </Box>
  ) : error ? (
    <Typography color="error" sx={{ textAlign: 'center' }}>
      Error: {error}
    </Typography>
  ) : products.length === 0 ? (
    <Typography sx={{ textAlign: 'center', color: 'gray', mt: 5 }}>
      No loan offers available.
    </Typography>
  ) : (
   <Grid container spacing={3} sx={{ justifyContent: 'center', px: 2 }}>
  {products.map((product, index) => (
    <Grid item key={index} sx={{ 
      display: 'flex',
      justifyContent: 'center',
      width: { xs: '100%', sm: 'auto' }
    }}>
      <Box
        sx={{
          position: 'relative',
          height: '380px',
          width: '280px',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          '&:hover': {
            transform: 'translateY(-8px) scale(1.02)',
            boxShadow: '0 12px 28px rgba(0,0,0,0.12)',
          },
          background: 'linear-gradient(145deg, #e6fbf9 0%, #d0f7f5 100%)',
          border: '1px solid rgba(36, 198, 239, 0.2)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header with accent */}
        <Box sx={{ 
          position: 'relative',
          pt: 3,
          px: 3,
          pb: 2,
          background: 'linear-gradient(90deg, rgba(36, 198, 239, 0.1) 0%, rgba(36, 198, 239, 0.05) 100%)',
          borderBottom: '1px solid rgba(36, 198, 239, 0.15)'
        }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: '#24c6ef',
              textAlign: 'center',
              fontSize: '1.3rem',
              letterSpacing: '0.5px',
              mb: 1.5,
              position: 'relative',
              '&:after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '3px',
                background: '#24c6ef',
                borderRadius: '3px',
              }
            }}
          >
            {product.type}
          </Typography>
        </Box>
        
        {/* Main content */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 3,
          pt: 2
        }}>
          {/* Interest rate badge */}
          <Box sx={{ 
            textAlign: 'center',
            mb: 3,
            mt: 1
          }}>
            <Chip
              label={`${product.interestRate}% Interest`}
              sx={{
                backgroundColor: 'rgba(36, 198, 239, 0.15)',
                color: '#24c6ef',
                fontWeight: 600,
                fontSize: '0.95rem',
                height: '32px',
                px: 1.5,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          </Box>
          
          {/* Loan details */}
          <Box sx={{ mb: 'auto' }}>
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2.5
            }}>
              <Typography variant="body2" sx={{ 
                color: '#666',
                fontSize: '0.85rem',
                mb: 0.5
              }}>
                Loan Amount
              </Typography>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: '#222',
                fontSize: '1.25rem'
              }}>
                ₹{product.minAmount} - ₹{product.maxAmount}
              </Typography>
            </Box>
            
            <Box sx={{ 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <Typography variant="body2" sx={{ 
                color: '#666',
                fontSize: '0.85rem',
                mb: 0.5
              }}>
                Tenure
              </Typography>
              <Typography variant="h6" sx={{ 
                fontWeight: 700,
                color: '#222',
                fontSize: '1.25rem'
              }}>
                {product.tenure} Year
              </Typography>
            </Box>
          </Box>
          
          {/* Apply button */}
          <Box sx={{ 
            textAlign: 'center',
            mt: 3,
            pt: 2,
            borderTop: '1px dashed rgba(36, 198, 239, 0.3)'
          }}>
           <Button
  variant="contained"
  sx={{
    backgroundColor: '#24c6ef',
    color: '#fff',
    fontWeight: 600,
    px: 4,
    py: 1,
    borderRadius: '8px',
    textTransform: 'none',
    fontSize: '0.95rem',
    boxShadow: '0 2px 12px rgba(36, 198, 239, 0.3)',
    '&:hover': {
      backgroundColor: '#1ca9cc',
      boxShadow: '0 4px 16px rgba(36, 198, 239, 0.4)',
    },
  }}
  onClick={() =>
    navigate('/applicationform', {
      state: {
        FinancecompanyName: companyName,
        loanType: product.type,
        loanTenure: product.tenure,
  companyId: location.state?.companyId      },
    })
  }

  
>
  Apply Now
</Button>

          </Box>
        </Box>
      </Box>
    </Grid>
  ))}
</Grid>
  )}
</Box>
    </>
  );
};

export default ProductDetailsPage;
