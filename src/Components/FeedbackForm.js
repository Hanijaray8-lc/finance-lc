import React, { useState } from 'react';
import Navbar from './Navbar';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Rating,
  Paper,
  
} from '@mui/material';
import axios from 'axios';
import { useLocation,useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';



const FeedbackForm = () => {
 const location = useLocation();
const { companyId, FinancecompanyName } = location.state;
const navigate = useNavigate();


  const [formData, setFormData] = useState({
    name: '',
    rating: 0,
    comment: '',
  });


   const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (event, newValue) => {
    setFormData({ ...formData, rating: newValue });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/feedback', { ...formData, companyId  , FinancecompanyName
});
      alert('Feedback submitted successfully!');
      setFormData({ name: '', rating: 0, comment: '' });
          navigate('/ReviewsPage', { state: { companyId, FinancecompanyName } });
    } catch (error) {
      console.error(error);
      alert('Failed to submit feedback');
    }
  };

  const handleGoBack = () => {
    // Navigate back to the previous page
    window.history.back();
  };
  return (
    <>
    <Navbar/>
    <Box sx={{background:'#e6fbf9',height:"100vh"}}>
{/*<Typography variant="h5">Leave your feedback for {FinancecompanyName
}</Typography>*/}
    <Container maxWidth="sm" sx={{ pt:{md:8,xs:1}}}>
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 3,
          background: ' #24c6efff',
          color: '#fff',
        }}
      >
       <Box 
  display="flex" 
  alignItems="center" 
  justifyContent="center" 
  sx={{ gap:{md:11 ,xs:1}}}
>
  {/* Back Button */}
 

  {/* Title */}
  <Typography
    variant="h4"
    gutterBottom
    sx={{ fontWeight: "bold",fontSize:{md:25,xs:15} }}
  >
    Submit Your Feedback
  </Typography>
   <Button
    variant="contained"
    startIcon={<ArrowBackIcon />}
    onClick={handleGoBack}
    sx={{
      backgroundColor: '#e6fbf9',
      color: "black",
      mr: 2,
      textTransform: "none",
      "&:hover": { backgroundColor: "#1daed6" }
    }}
  >
    Back
  </Button>
</Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
            <TextField
    label="Finance Company Name"
    name="companyName"
    fullWidth
    value={FinancecompanyName}
    margin="normal"
    variant="filled"
    InputProps={{
      readOnly: true,
      style: { backgroundColor: '#e6fbf9' },
    }}
  />
          <TextField
            label="Your Name"
            name="name"
            fullWidth
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            variant="filled"
            InputProps={{
              style: { backgroundColor: '#e6fbf9' },
            }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3 }}>
            <Typography variant="h6" sx={{ mr: 2 }}>
              Rating:
            </Typography>
            <Rating
              name="rating"
              value={formData.rating}
              onChange={handleRatingChange}
              sx={{ color: '#ffeb3b' }}
            />
          </Box>
          <TextField
            label="Your Comment"
            name="comment"
            fullWidth
            multiline
            rows={4}
            value={formData.comment}
            onChange={handleChange}
            margin="normal"
            required
            variant="filled"
            InputProps={{
              style: { backgroundColor: '#e6fbf9' },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{
              mt: 4,
              py: 1.5,
              color:"#24c6efff",
              fontWeight: 'bold',
              backgroundColor: '#e6fbf9',
              '&:hover': {
                backgroundColor: '#fac0b2ff',
              },
            }}
          >
            Submit Feedback
          </Button>
        </Box>
      </Paper>
    </Container>
    </Box>
    </>
  );
};

export default FeedbackForm;

