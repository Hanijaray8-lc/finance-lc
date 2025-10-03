import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import axios from 'axios';
import AdminSidebar from './Adminsidebar';
   import {   useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";


const ProductsPage = () => {
  const [companyName, setCompanyName] = useState('');
  const [companyList, setCompanyList] = useState([]);
  const [products, setProducts] = useState([
    { type: '', interestRate: '', minAmount: '', maxAmount: '', tenure: '' },
  ]);
    const navigate = useNavigate();
    
const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch finance company names on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/financeCompanies');
        setCompanyList(res.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  const handleProductChange = (index, e) => {
    const newProducts = [...products];
    newProducts[index][e.target.name] = e.target.value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([
      ...products,
      { type: '', interestRate: '', minAmount: '', maxAmount: '', tenure: '' },
    ]);
  };

  const removeProduct = (index) => {
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      companyName,
      products,
    };

    try {
      const res = await axios.post('http://localhost:5000/api/products', payload);
      console.log(res.data);
      alert('Products saved successfully!');
      setCompanyName('');
      setProducts([
        { type: '', interestRate: '', minAmount: '', maxAmount: '', tenure: '' },
      ]);
    } catch (error) {
      console.error(error);
      alert('Failed to save products.');
    }
  };

  useEffect(() => {
  const storedCompanyName = localStorage.getItem("companyName");
  if (storedCompanyName) {
    setCompanyName(storedCompanyName);
  }
}, []);
  const handleBack = () => {
    navigate(-1); // go back to previous page
  };

  return (<>
    <AdminSidebar/>
    <Box sx={{ 
      p:{md:3,xs:3} , 
      backgroundColor: '#cdebf3ff', 
      minHeight: '100vh' 
    }}>
      <Paper elevation={3} sx={{ 
        p: 3, 
        backgroundColor: '#e6fbf9', 
        mb: 4,
        borderRadius: 2,
        ml:{md:'240px',xs:0},
        minHeight:'85vh'
      }}>


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
    variant="h4"
    sx={{
      fontWeight: "bold",
      color: "#24c6efff",
      fontSize: { md: 20, xs: 15 },
      textAlign: "left",
    }}
  >
    Add Loan Offers 
  </Typography>

  {isMobile ? (
    <ArrowBackIcon
      onClick={handleBack}
      sx={{ cursor: "pointer", color: "#24c6efff" }}
    />
  ) : (
    <Button
      onClick={handleBack}
      startIcon={<ArrowBackIcon />}
      sx={{
        color: "#24c6efff",
        fontWeight: "bold",
        textTransform: "none",
        fontSize: { md: 16, xs: 14 },
      }}
      variant="outlined"
    >
      Back
    </Button>
  )}
</Box>


        <Box component="form" onSubmit={handleSubmit}>
          {/* Dropdown for company names */}
         <TextField
  label="Finance Company"
  name="companyName"
  fullWidth
  value={companyName}
  InputProps={{
    readOnly: true,
  }}
  sx={{ 
    mb: {md:3,xs:1},
    backgroundColor: 'white',
    borderRadius: 1,
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#24c6efff',
      },
      '&:hover fieldset': {
        borderColor: '#24c6efff',
      },
    }
  }}
/>
            <Button
            variant="contained"
            startIcon={<AddCircleIcon />}
            onClick={addProduct}
            sx={{ 
              mb: {md:3,xs:1},
              width:{md:"200px",xs:"255px"},
              backgroundColor: '#24c6efff',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1e9fc7'
              }
            }}
          >
            Add loan offers
          </Button>

          <Grid container spacing={2}>
            {products.map((product, index) => (
              <Grid container spacing={2} key={index} sx={{ mb: 2 }}>
                <Paper elevation={2} sx={{ 
                  p: 1, 
                  width: '100%',
                  backgroundColor: 'white',
                  borderRadius: 2
                }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Product Type"
                        name="type"
                        fullWidth
                        value={product.type}
                        onChange={(e) => handleProductChange(index, e)}
                        required                        sx={{width:{md:'270px',xs:"247px"}}}

                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Interest Rate (%)"
                        name="interestRate"
                        fullWidth
                        value={product.interestRate}
                        onChange={(e) => handleProductChange(index, e)}
                        required                 
                               sx={{width:{md:'270px',xs:"247px"}}}

                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Min Amount (₹)"
                        name="minAmount"
                        fullWidth
                        value={product.minAmount}
                        onChange={(e) => handleProductChange(index, e)}
                        required
                              sx={{width:{md:'270px',xs:"247px"}}}

                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Max Amount (₹)"
                        name="maxAmount"
                        fullWidth
                        value={product.maxAmount}
                        onChange={(e) => handleProductChange(index, e)}
                        required
 sx={{width:{md:'270px',xs:"247px"}}}                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        label="Tenure (months)"
                        name="tenure"
                        fullWidth
                        value={product.tenure}
                        onChange={(e) => handleProductChange(index, e)}
                        required
                        sx={{ml:{md:'285px',xs:0},width:{md:'555px',xs:"247px"}}}
                      />
                    </Grid>
                    <Grid item xs={12} sx={{ textAlign: 'right' ,ml:{md:0,xs:14}}}>
                      <IconButton 
                        color="error" 
                        onClick={() => removeProduct(index)}
                        sx={{
                          color: '#24c6efff',
                          '&:hover': {
                            color: '#f44336'
                          }
                        }}
                      >
                        <RemoveCircleIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Button 
            type="submit" 
            variant="contained" 
            sx={{ 
              mt:{md:3,xs:0} ,
              backgroundColor: '#24c6efff',
              ml:{md:0,xs:6},
              color: 'white',
              '&:hover': {
                backgroundColor: '#1e9fc7'
              }
            }}
            
          >
            Save Products
          </Button>
        </Box>
      </Paper>
    </Box>
    </>
  );
};

export default ProductsPage;

