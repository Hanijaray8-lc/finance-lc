import React, { useState } from 'react';
import { Box, Grid, Typography, Card, CardContent, CardMedia ,TextField, Button,Paper,Badge,
  Dialog,
  DialogTitle,
  DialogContent,
 } from '@mui/material';
 import { useLocation } from 'react-router-dom';
 import { IconButton, Tooltip, Link } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import BusinessIcon from '@mui/icons-material/Business';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
import  {  useEffect } from 'react';
import axios from 'axios';
import '@fontsource/caladea';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Toolbar,} from "@mui/material";
import { Slide } from "@mui/material";
import { keyframes } from "@mui/system";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const FinanceCompaniesPage = () => {
   const [searchQuery, setSearchQuery] = useState('');

const [companies, setCompanies] = useState([]);
const [selectedCompany, setSelectedCompany] = useState(null);

const location = useLocation();
const { companyId, FinancecompanyName } = location.state || {};

const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

   const [productCount, setProductCount] = useState(0);
  const [products, setProducts] = useState([]);
  const companyName = 'ABC Industries'; 

useEffect(() => {
  const fetchCompanies = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/financecompanies/approved');
      setCompanies(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  fetchCompanies();
}, []);


useEffect(() => {
  const fetchReviews = async () => {
    if (!selectedCompany) return;

    const res = await axios.get(`http://localhost:5000/api/feedback/${selectedCompany._id}`);
    setReviews(res.data);

    // Calculate average rating
    if (res.data.length > 0) {
      const totalRating = res.data.reduce((sum, r) => sum + r.rating, 0);
      const avg = (totalRating / res.data.length).toFixed(1);
      setAverageRating(avg);
    } else {
      setAverageRating(0);
    }
  };
  fetchReviews();
}, [selectedCompany]);


const navigate = useNavigate();



  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

// Change this based on login/company context

// Add this useEffect to fetch products when a company is selected
useEffect(() => {
  const fetchProducts = async () => {
    if (!selectedCompany) return;
    
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products/${encodeURIComponent(selectedCompany.name)}`
      );
      setProducts(res.data.products);
      setProductCount(res.data.products.length);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  fetchProducts();
}, [selectedCompany]);

// Update the notification badge to navigate to product details

const styles = {
  "@keyframes marquee": {
    "0%": { transform: "translateX(100%)" },
    "100%": { transform: "translateX(-100%)" },
  },
};


// heartbeat keyframes
const heartbeat = keyframes`
  0% { transform: scale(1); }
  25% { transform: scale(1.05); }
  40% { transform: scale(0.95); }
  60% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const handleGoBack = () => {
    // Navigate back to the previous page
    window.history.back();
  };



  return (
    <>
    <Navbar/>
    <Box sx={{ flexGrow: 1, p: {md:2,xs:0}, backgroundColor: '#cdebf3ff', minHeight: '90vh' }}>
      <Grid container spacing={4}>
        
        {/* Left Side - Companies List */}
        <Grid item xs={12} md={6}  sx={{width:{md:'70%',xs:'100%'}}}>
<Grid 
  container 
  alignItems="center" 
  justifyContent="space-between" // 🔥 pushes text left, button right
  sx={{ width: "100%",mb:1,mt:{xs:1,md:0} }}
>
  <Grid item>
    <Typography
      variant="h5"
      noWrap
      sx={{
        color: "#24c6efff",
        fontWeight: "bold",
        fontSize: { md: 32, sm: 18, xs: 12 },
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
    >
      All Finance Companies
    </Typography>
  </Grid>

 <Grid item>
  <Button
    variant="outlined"
    onClick={handleGoBack}
    startIcon={<ArrowBackIcon sx={{ fontSize: { md: 24, xs: 14 } }} />}
    sx={{
      ml: { xs: 4, sm: 0 },   // ✅ gap on mobile only
      color: "white",
      backgroundColor: "#24c6efff",
      fontSize: { md: 16, xs: 10 },
      padding: { md: "6px 16px", xs: "2px 6px" },
      minWidth: "auto",
      "&:hover": {
        backgroundColor: "#e6f7ff",
      },
    }}
  >
    Back
  </Button>
</Grid>

  </Grid>



<Grid sx={{ border: 1,borderColor:'  #24c6efff', p: 2 ,borderRadius:'10px',width:{xs:'350px',md:'100%',}}}>
  <Box sx={{ mb: 2 }}>
    <TextField
      fullWidth
      variant="outlined"
      placeholder="Search for a company..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      sx={{
        backgroundColor: '#fff',
        borderRadius: 1,
      }}
    />
  </Box>

  <Box sx={{ maxHeight:{md:'500px',xs:'220px'} , overflowY: 'auto' }}>
    <Grid container spacing={2}>
      {filteredCompanies.map((company) => (
        <Grid item xs={12} sm={6} key={company.id}>
          <Card
            onClick={() => setSelectedCompany(company)}
            sx={{
              cursor: 'pointer',
              backgroundColor: '#e6fbf9' ,
              '&:hover': { backgroundColor:'#76cfc6ff' },
              width: {md:'495px',xs:'350px'},
              display: 'flex',
              flexDirection: 'row',
              height: 150,
            }}
          >
            <CardMedia
              component="img"
  image={`http://localhost:5000/uploads/${company.logo}`}
                alt={company.name}
              sx={{
                width: {md:150,xs:80},
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#fff',
                p: 1,
              }}
            />
            <CardContent
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                pl: 2,
              }}
            >
              <Typography variant="h6" sx={{ color: '#24c6efff', fontWeight: 'bold' }}>
                {company.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {company.description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
</Grid>
 </Grid>

        {/* Right Side - Selected Company Details */}
      <Grid item xs={12} md={6} sx={{width:"400px",}}>
        
  {selectedCompany ? (
    <Box
      sx={{
        p: 3,
        backgroundColor: '#24c6efff',
        borderRadius: 2,
        minHeight: '400px',
        color: '#fff',
        height:"82vh",
      }}
    >
  {/* Apply Now Banner */}
<Box
  sx={{
    background: '#e6fbf9',
    color: '#24c6efff',
    fontWeight: "bold",
    p: 1.5,
    borderRadius: "12px",
    mb: 1,
    overflow: "hidden",
    boxShadow: "0 0 10px #0ff, 0 0 20px #0ff",
  }}
>
  <Box
    sx={{
      whiteSpace: "nowrap",
      display: "inline-block",
      animation: "marquee 8s linear infinite",
    }}
      onClick={() => navigate('/ApplicationForm', { state: { FinancecompanyName: selectedCompany.name } })}

  >
    🚀 Apply Now · 🚀 Apply Now · 🚀 Apply Now
  </Box>
</Box>

<style>
{`
@keyframes marquee {
  0%   { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
`}
</style>
 {/* Company Name */}
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold',textAlign:'center',fontSize:{md:25,xs:20} }}>
        {selectedCompany.name}
      </Typography>

      {/* Company Logo */}
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
  <Box
    component="img"
    src={`http://localhost:5000/uploads/${selectedCompany.logo}`}
    alt={selectedCompany.name}
    sx={{
      backgroundColor: '#fff',
      borderRadius: '8px',
      padding: '10px',
      marginBottom: '14px',
      height: { xs: 50, md: 50 }, // xs = mobile, md = desktop
      width: { xs: 80, md: 80 },  // reduce size for both views
      objectFit: 'contain',       // image fit properly
    }}
  />
</Box>




 {selectedCompany.details && (
        <Typography variant="subtitle1" sx={{ fontStyle: 'italic', mb: 1,textAlign:'center',fontSize:{md:12,xs:12} }}>
          "{selectedCompany.details}"
        </Typography>
      )}
  <Box
  sx={{
    mb: 1,
    position: 'relative',
    ml:{md:5,xs:0}
  }}
>

     <Button
  variant="contained"
  sx={{
    width: { xs: '300px', md: '280px' },
    textTransform: 'none',
    backgroundColor: '#1976d2',
    color: 'white',
    fontWeight: 'bold',
    px: { md: 3, xs: 2 },
    py: { md: 1.5, xs: 1 },
    fontSize: { md: '16px', xs: '12px' },
    mt: 1,
    animation: `${heartbeat} 1.5s infinite`, // 👈 heartbeat effect
    borderRadius: "8px",
  }}
 onClick={() =>
  navigate('/ApplicationForm', {
    state: { 
      FinancecompanyName: selectedCompany.name,
      companyId: selectedCompany.companyId // இதை சேர்க்கவும்
    }
  })
}
>
  
  Apply now
</Button>
  <Button
    variant="contained"
    sx={{
      width:{xs:'300px',md:'280px'},
      textTransform: 'none',
      backgroundColor: '#e6fbf9',
      color: '#0d0d0cff',
      px: { md: 3, xs: 2 },
      py: { md: 1.5, xs: 1 },
      fontSize: { md: '16px', xs: '12px' },
      mt:1 // ✅ text responsive
    }}
   onClick={() =>
  navigate('/ProductDetails', {
    state: {
      companyName: selectedCompany.name,
      companyId: selectedCompany.companyId // இதையும் சேர்க்கலாம்
    }
  })
}
  >
    View Products Offered
  </Button>


  {/* Notification Icon Positioned Responsively */}
  <Box
    sx={{
      position: 'absolute',
      top: { md: 65, xs: 50 }, // ✅ adjust for small screens
      right: { md: 25, xs: 10 }, // ✅ closer in mobile
    }}
  >
    <Badge
      badgeContent={productCount}
      color="error"
      overlap="circular"
      sx={{ cursor: 'pointer' }}
     
    >
      <NotificationsIcon sx={{ color: 'gold', fontSize: { md: 28, xs: 20 } }} />
    </Badge>
  </Box>
</Box>



 
    {/* Ratings / Reviews */}
 <Box sx={{    ml:{md:5,xs:0}
}}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, marginLeft: '80px',fontSize:{md:15,xs:12} }}>
    Ratings & Reviews:
  </Typography>

  {reviews.length > 0 ? (
    <Grid container spacing={2} sx={{ width: '100%', margin: 'auto' }}>
      {/* First Row: Ratings & Reviews Count */}
      <Grid item xs={6}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#e6fbf9' ,
            borderRadius: 2,
            border: '1px solid #ddd',
            height: '50px', // set fixed height
            color: '#0d0d0cff',
                        minWidth:{md:"110px",xs:"120px"}

          }}
        >
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
            ⭐ {averageRating} / 5
          </Typography>
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#e6fbf9' ,
            borderRadius: 2,
            height: '50px',
            minWidth:{md:"110px",xs:"120px"},
            color: '#0d0d0cff',
            cursor: 'pointer',
            '&:hover': { backgroundColor: '#fcb5a1' },
          }}
          onClick={() =>
            navigate('/ReviewsPage', {
              state: {
                companyId: selectedCompany._id,
                FinancecompanyName: selectedCompany.name,
              },
            })
          }
        >
          <Typography variant="body2">({reviews.length} reviews)</Typography>
        </Box>
      </Grid>

    
    </Grid>
  ) : (
    <Typography variant="body2" sx={{ ml: '80px' }}>
      No ratings available.
    </Typography>
  )}
</Box>
<Grid container sx={{ width: '100%', margin: 'auto', gap: 2, marginTop: 2,    ml:{md:5,xs:0}
 }}>
  <Grid item xs={12}>
    <Button
      variant="contained"
      onClick={() =>
        navigate('/FeedbackForm', {
          state: {
            companyId: selectedCompany._id,
            FinancecompanyName: selectedCompany.name,
          },
        })
      }
      sx={{
        textTransform: 'none',
        backgroundColor: '#e6fbf9',
        color: '#0d0d0cff',
        width: {md:'275px',xs:'300px'}, // ✅ correct property
        padding: '25px',
        borderRadius: 2,
        height: '20px',
        '&:hover': { backgroundColor: '#fcb5a1' },
      }}
    >
      Leave a Review
    </Button>
  </Grid>
</Grid>

    

   {/* Contact Details */}
<Box
  sx={{
    display: 'flex',
    gap: { xs: 1, sm: 2 }, // smaller gap on mobile
    mb: 1,
    ml: { xs: 1, sm: '80px' }, // reduce left margin on mobile
    mt: 2,
    flexWrap: 'wrap', // allows wrapping on very small screens
    justifyContent: { xs: 'center', sm: 'flex-start' }, // center on mobile
  }}
>
  <Tooltip title={selectedCompany.contactNumber}>
    <Paper elevation={3} sx={{ borderRadius: 2, background: '#e6fbf9' }}>
      <IconButton
        component="a"
        href={`tel:${selectedCompany.contactNumber}`}
        sx={{ color: '#1976d2', p: { xs: 0.5, sm: 1 } }} // smaller padding on mobile
      >
        <PhoneIcon sx={{ fontSize: { xs: 20, sm: 24 } }} /> {/* smaller icon on mobile */}
      </IconButton>
    </Paper>
  </Tooltip>

  <Tooltip title={selectedCompany.email}>
    <Paper elevation={3} sx={{ borderRadius: 2, background: '#e6fbf9' }}>
      <IconButton
        component="a"
        href={`mailto:${selectedCompany.email}`}
        sx={{ color: '#1976d2', p: { xs: 0.5, sm: 1 } }}
      >
        <EmailIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
      </IconButton>
    </Paper>
  </Tooltip>

  <Tooltip title={selectedCompany.website}>
    <Paper elevation={3} sx={{ borderRadius: 2, background: '#e6fbf9' }}>
      <IconButton
        component={Link}
        href={selectedCompany.website}
        target="_blank"
        rel="noopener"
        sx={{ color: '#1976d2', p: { xs: 0.5, sm: 1 } }}
      >
        <LanguageIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
      </IconButton>
    </Paper>
  </Tooltip>

  {selectedCompany.branch && (
    <Tooltip title={selectedCompany.branch}>
      <Paper elevation={3} sx={{ borderRadius: 2, background: '#e6fbf9' }}>
        <IconButton sx={{ color: '#1976d2', p: { xs: 0.5, sm: 1 } }}>
          <BusinessIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
        </IconButton>
      </Paper>
    </Tooltip>
  )}
</Box>

{/* Footer or Apply Now CTA */}
<Box sx={{ textAlign: 'center', mt: 1 }}>
  <Typography variant="body2">
    Visit website for more details.
  </Typography>
</Box>

    </Box>
  ) : (
    <Box
      sx={{
        p: {md:3,xs:1},
        backgroundColor:'#e6fbf9',
        borderRadius: 2,
        minHeight: {md:'590px',xs:'270px'},
        justifyContent: 'center',
        alignItems: 'center',
        width:{md:'350px',xs:'348px'}
      }}
    >
           <Box
              sx={{
                width: {md:150,xs:100},
                height: {md:150,xs:100},
                backgroundColor: '#1b2a41',
                clipPath: 'polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                      marginLeft:{md:'100px',xs:'120px'},
                       marginTop:{md:'100px',xs:2}
              }}
            >
             <img src='/Images/logo2.png' alt='logo2' height={"100px"}  width={"100px"}  />
            </Box>
            <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: '#24c6efff',textAlign:"center",  fontFamily: 'Caladea',fontSize:{md:35,xs:25}
 }}>
Choose The Right Finance Company For Your Next Big Move</Typography>
<Typography
  variant="h6"
  sx={{
    color: '#080808ff',
    fontFamily: 'Caladea',
    textAlign: "center",
    fontSize: { md: 20, xs: 13 },
    backgroundColor: '#e6fbf9',   // ✅ Background color
    border: '2px solid #24c6ef',  // ✅ Border color
    borderRadius: '12px',         // ✅ Rounded corners
    display: 'inline-block',      // ✅ Text wrap avoid & center look
    px: 2,                        // ✅ Padding X
    py: 1,                        // ✅ Padding Y
    animation: `${heartbeat} 1.5s infinite`, // 👈 Heartbeat animation
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)', // ✅ Shadow for effect
    ml:{md:3,xs:8}
  }}
>
  Select a company to view details
</Typography>
    </Box>
  )}
</Grid>

      </Grid>
    </Box>
    </>
  );
};

export default FinanceCompaniesPage;

