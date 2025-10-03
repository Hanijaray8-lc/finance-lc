import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Paper,
  Box,
  Button,
  TableContainer
} from '@mui/material';
import ReplyIcon from '@mui/icons-material/Reply';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import AdminSidebar from './Adminsidebar';
   import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";






const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingToId, setReplyingToId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();



  const companyName = localStorage.getItem("companyName");

  useEffect(() => {
    fetchFeedbacks();
  }, [refresh]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/feedback');
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
      alert('Failed to fetch feedbacks');
    }
  };

  const handleReplySubmit = async () => {
    try {
      await axios.post(`http://localhost:5000/api/feedback/reply/${replyingToId}`, {
        reply: replyText,
      });
      setReplyText('');
      setReplyingToId(null);
      setRefresh(!refresh);
    } catch (err) {
      console.error('Error submitting reply:', err);
    }
  };

  const handleReplyClick = (id) => {
    setReplyingToId(id);
  };

  // Filter logic
  const filteredFeedbacks = feedbacks.filter((fb) =>
    fb.FinancecompanyName === companyName &&
    (fb.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fb.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

const handleBack = () => {
  navigate(-1); // Goes back to the previous page
};

  return (
    <>
      <AdminSidebar />
      <Box sx={{ backgroundColor: '#cdebf3ff', minHeight: '100vh', py: 5, width: "100%" }}>
        <Container maxWidth="1200px">
          <Paper elevation={3} sx={{ p: 4, background: '#e6fbf9', marginLeft: { md: "240px", xs: 0 } }}>
       

<Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center", // center title and button horizontally
    gap: {md:110,xs:2},
    mb: 3,
    flexWrap: { xs: "wrap", md: "nowrap" }, // wrap on mobile if needed
  }}
>
  <Typography
    variant="h4"
    sx={{
      fontWeight: "bold",
      fontSize: { md: 25, xs: 18 },
      textAlign: "center",
    }}
  >
    Feedbacks List
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
        fontSize: 16,
      }}
      variant="outlined"
    >
      Back
    </Button>
  )}
</Box>


            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <TextField
                label="Search by name or comment"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                variant="outlined"
                fullWidth
                sx={{ background: "white" }}
              />
            </Box>

            {/* ✅ Responsive Table Container */}
            <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#24c6efff' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Company</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Rating</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Comment</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Reply</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredFeedbacks.length > 0 ? (
                    filteredFeedbacks.map((fb) => (
                      <TableRow key={fb._id} sx={{ background: 'white' }}>
                        <TableCell>{fb.name}</TableCell>
                        <TableCell>{fb.FinancecompanyName || "N/A"}</TableCell>
                        <TableCell>{fb.rating}/5</TableCell>
                        <TableCell>{fb.comment}</TableCell>
                        <TableCell>
                          <Button
                            startIcon={<ReplyIcon />}
                            size="small"
                            onClick={() => handleReplyClick(fb._id)}
                            sx={{ textTransform: 'none', color: '#24c6efff' }}
                          >
                            Admin Reply
                          </Button>

                          {/* Reply Dialog */}
                          <Dialog
                            open={Boolean(replyingToId)}
                            onClose={() => setReplyingToId(null)}
                            fullWidth
                            maxWidth="sm"
                          >
                            <DialogTitle>Write a Reply</DialogTitle>
                            <DialogContent>
                              <TextField
                                label="Your reply"
                                fullWidth
                                multiline
                                rows={4}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                              />
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => setReplyingToId(null)} color="error">
                                Cancel
                              </Button>
                              <Button onClick={handleReplySubmit} variant="contained" sx={{ backgroundColor: '#24c6efff' }}>
                                Submit Reply
                              </Button>
                            </DialogActions>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No feedbacks found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default FeedbackList;

