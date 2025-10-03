import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  IconButton,
  Divider,
  Grid
} from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';

import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ReplyIcon from '@mui/icons-material/Reply';
import CommentIcon from '@mui/icons-material/Comment';
import Navbar from './Navbar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const ReviewsPage = () => {
  const location = useLocation();
  const { companyId, FinancecompanyName } = location.state;

  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [publicCommentText, setPublicCommentText] = useState('');
  const [commentingOn, setCommentingOn] = useState(null);
  const [replyText, setReplyText] = useState({});

const currentUsername = localStorage.getItem('username');



  useEffect(() => {
    fetchReviews();
  }, [companyId]);

  const fetchReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/feedback/${companyId}`);
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const handleLike = async (reviewId) => {
    try {
await axios.post(`http://localhost:5000/api/feedback/like/${reviewId}`, {
  username: currentUsername,
});
      fetchReviews();
    } catch (err) {
      console.error("Error liking review:", err);
    }
  };
  


  const openReplyDialog = (review) => {
    setSelectedReview(review);
    setAdminReplyText('');
  };

  const submitAdminReply = async () => {
    try {
      await axios.post(`http://localhost:5000/api/feedback/reply/${selectedReview._id}`, {
        reply: adminReplyText,
      });
      setAdminReplyText('');
      setSelectedReview(null);
      fetchReviews();
    } catch (err) {
      console.error("Error submitting reply:", err);
    }
  };

  const submitPublicComment = async (reviewId) => {
    try {
      await axios.post(`http://localhost:5000/api/feedback/comment/${reviewId}`, {
        text: publicCommentText,
      });
      setPublicCommentText('');
      setCommentingOn(null);
      fetchReviews();
    } catch (err) {
      console.error("Error submitting comment:", err);
    }
  };
  const handleGoBack = () => {
    // Navigate back to the previous page
    window.history.back();
  };

  return (
    <>
      <Navbar />
      <Box sx={{}}>
      <Box sx={{ p: {md:4,xs:2}, backgroundColor: '#e6f7fc',pl:{md:0,xs:3}, minHeight: '100vh', }}>
       <Grid 
  container 
  alignItems="center" 
  justifyContent="space-between" 
  sx={{ mb: 2 }}
>
  {/* Title */}
  <Grid item>
    <Typography 
      variant="h4" 
      gutterBottom 
      sx={{ 
        fontWeight: 'bold', 
        color: '#24c6ef',
        fontSize: { md: 25, xs: 15 }
      }}
    >
      Reviews for {FinancecompanyName}
    </Typography>
  </Grid>

  {/* Back Button */}
  <Grid item>
    <Button
      variant="contained"
      onClick={handleGoBack}
      startIcon={<ArrowBackIcon />}
      sx={{
        backgroundColor: "#24c6ef",
        color: "white",
        fontSize: { md: 14, xs: 10 },
        padding: { md: "6px 14px", xs: "2px 6px" },
        textTransform: "none",
        "&:hover": { backgroundColor: "#1daed6" }
      }}
    >
      Back
    </Button>
  </Grid>
</Grid>


        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: {xs:'82%',md:'97%',}  }}>
          {reviews.map((review) => (
        <Paper
  key={review._id}
  sx={{
    p: 3,
    borderRadius: 3,
    backgroundColor: '#ffffff',
    boxShadow: 2,
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' }, // ✅ column on mobile
    gap: 3,
    width: '100%',
    height:{md:350,xs:550}
  }}
>
  {/* Review + Actions + Replies */}
  <Box sx={{ flex: 2, minWidth: 0 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
      <Avatar sx={{ bgcolor: '#24c6ef', mr: 2 }}>
        {review.name.charAt(0).toUpperCase()}
      </Avatar>
      <Box>
        <Typography variant="h6">{review.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          ⭐ {review.rating} / 5
        </Typography>
      </Box>
    </Box>

    <Typography variant="body1" sx={{ mb: 2, wordBreak: 'break-word' }}>
      {review.comment}
    </Typography>

    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      <Button
        startIcon={<ThumbUpIcon />}
        onClick={() => handleLike(review._id)}
        sx={{ color: '#24c6ef', textTransform: 'none' }}
        disabled={Array.isArray(review.likes) && review.likes.includes(currentUsername)}
      >
        Like
      </Button>
      <Typography variant="caption">
        {Array.isArray(review.likes) ? review.likes.length : 0} likes
      </Typography>
    </Box>

    <Divider sx={{ my: 1 }} />

    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>
      Company Replies
    </Typography>
    {review.replies?.length > 0 ? (
      <Box sx={{ maxHeight: { xs: 120, md: 150 }, overflowY: 'auto', mt: 1 }}>
        {review.replies.map((r, idx) => (
          <Paper key={idx} sx={{ p: 1, mb: 1, backgroundColor: '#f0fdf4' }}>
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {r.text}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(r.date).toLocaleString()}
            </Typography>
          </Paper>
        ))}
      </Box>
    ) : (
      <Typography variant="caption" color="text.secondary">
        No replies yet.
      </Typography>
    )}
  </Box>

  {/* Public Comments */}
  <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' } }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="subtitle2">Public Comments</Typography>
      <IconButton onClick={() => setCommentingOn(commentingOn === review._id ? null : review._id)}>
        <CommentIcon sx={{ color: '#24c6ef' }} />
      </IconButton>
    </Box>

    {commentingOn === review._id && (
      <Box sx={{ mt: 1 }}>
        <TextField
          placeholder="Write a comment..."
          fullWidth
          multiline
          minRows={2}
          value={publicCommentText}
          onChange={(e) => setPublicCommentText(e.target.value)}
        />
        <Button
          onClick={() => submitPublicComment(review._id)}
          sx={{ mt: 1, backgroundColor: '#24c6ef', color: 'white' }}
          variant="contained"
          size="small"
          fullWidth={true} // ✅ button takes full width on mobile
        >
          Submit
        </Button>
      </Box>
    )}

    <Box sx={{ maxHeight: { xs: 150, md: 300 },   overflowY: 'scroll', mt: 1 }}>
      {review.comments?.length > 0 ? (
        review.comments.map((cmt, idx) => (
          <Paper key={idx} sx={{ p: 1, my: 1, backgroundColor: '#f5f5f5' }}>
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {cmt.text}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(cmt.date).toLocaleString()}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="caption" color="text.secondary">No comments yet.</Typography>
      )}
    </Box>
  </Box>
</Paper>


          ))}
        </Box>

     
      </Box>
      </Box>
    </>
  );
};

export default ReviewsPage;

