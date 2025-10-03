import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import AdminSidebar from './Adminsidebar';
import {  useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const AdminNotifications = () => {
  const [announcementData, setAnnouncementData] = useState({
    company: '',
    user: '',
    dueDate: '',
    description: ''
  });

  const [companyList, setCompanyList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [search, setSearch] = useState('');
  const theme = useTheme();
const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  // Get company name from localStorage
  const companyName = localStorage.getItem("companyName");

  useEffect(() => {
    fetchCompanies();
    fetchUsers();
    fetchAnnouncements();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/financeCompanies');
      setCompanyList(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/users');
      setUserList(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/Notification');
      // Filter announcements by the logged-in company
      const filteredAnnouncements = response.data.filter(
        announcement => announcement.company === companyName
      );
      setAnnouncements(filteredAnnouncements.reverse());
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  const handleChange = (e) => {
    setAnnouncementData({ ...announcementData, [e.target.name]: e.target.value });
  };

  const handlePost = async () => {
    const { company, user, dueDate, description } = announcementData;

    if (!company || !user || !dueDate || !description.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/admin/Notification', {
        company, user, dueDate, description
      });

      setAnnouncementData({ company: companyName, user: '', dueDate: '', description: '' });
      fetchAnnouncements();
    } catch (error) {
      console.error('Error posting announcement:', error);
      alert('Error posting notification. Please check your backend route.');
    }
  };

  // Filter announcements by search term and ensure they belong to the logged-in company
  const filteredAnnouncements = announcements.filter((a) =>
    a.company.toLowerCase().includes(search.toLowerCase()) &&
    a.company === companyName
  );

  const markAsRead = async (notificationId) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/Notification/mark-as-read-id/${notificationId}`);
      fetchAnnouncements(); // refresh the table
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  useEffect(() => {
    if (companyName) {
      setAnnouncementData(prev => ({
        ...prev,
        company: companyName
      }));
    }
    fetchUsers();
    fetchAnnouncements();
  }, [companyName]);

    const handleBack = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <>
      <AdminSidebar/>
      <Box sx={{ p: 1, bgcolor: '#cdebf3ff', minHeight:{md: '100vh',xs:'170vh'} }}>
     <Box
  sx={{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    mb: 3,
    ml: { md: "240px", xs: 6},
    mr: { xs: 2, md: 0 },
    mt: 1,
    gap: {md:100,xs:0}
  }}
>
  <Typography
    variant="h4"
    sx={{
      fontWeight: "bold",
      color: "#24c6efff",
      fontSize: { md: 25, xs: 20 },
    }}
  >
    Notifications & Due Alerts
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
      <Box 
  sx={{ 
    display: "flex", 
    flexDirection: { xs: "column", md: "row" }, // column on mobile, row on desktop
    gap: 3, 
    maxHeight: "100vh",
  }}
>

    {/* form content */}

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, backgroundColor:  '#e6fbf9', mb: {md:4,xs:0}, width: "280px", height: "78vh", ml: {md:"240px",xs:0} }}>
            <img src='./Images/Announce.png' alt='' height={150} width={280} />
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Finance Company"
                  name="company"
                  value={announcementData.company}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: 1,
                    minWidth: "280px"
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  select
                  name="user"
                  label="Select User"
                  value={announcementData.user}
                  onChange={handleChange}
                  sx={{ backgroundColor: 'white', borderRadius: 1, minWidth: "280px" }}
                >
                  {userList.map((user) => (
                    <MenuItem key={user._id} value={user.name}>
                      {user.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  type="date"
                  name="dueDate"
                  label="Due Date"
                  InputLabelProps={{ shrink: true }}
                  value={announcementData.dueDate}
                  onChange={handleChange}
                  sx={{ backgroundColor: 'white', borderRadius: 1, minWidth: "280px" }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  name="description"
                  label="Description"
                  multiline
                  rows={1}
                  fullWidth
                  value={announcementData.description}
                  onChange={handleChange}
                  sx={{ backgroundColor: 'white', borderRadius: 1, width: "280px" }}
                />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handlePost}
                sx={{
                  backgroundColor: '#24c6efff',
                  color: '#fff',
                  mt: 2,
                  ml: '90px',
                  fontWeight: 'bold',
                  '&:hover': { backgroundColor: '#1bb2d6' },
                  px: 4, py: 1
                }}
              >
                Send
              </Button>
            </Grid>
          </Paper>


  {/* Announcement Table */}
  <Paper 
    elevation={2} 
    sx={{ 
      p: 3, 
      borderRadius: 2, 
      width: { xs: "300px", md: "800px" }, 
      height: { md: "80vh", xs: "auto" }, 
      backgroundColor: '#e6fbf9' 
    }}
  >
    {/* table content */}

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold',fontSize:{md:25,xs:15} }}>
              Announcements List ({companyName})
            </Typography>

            <TextField
              placeholder="Search by user name"
              fullWidth
              variant="outlined"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                style: { backgroundColor: 'white', borderRadius: 8 },
              }}
            />

            {/* Scrollable Table Container */}
            <Box sx={{ overflowY: 'auto', maxHeight: '400px' }}>
              <Table  sx={{
    "& .MuiTableCell-root": {
      padding: { xs: "4px 6px", md: "10px 18px" }, // small padding on mobile
      fontSize: { xs: "0.7rem", md: "0.9rem" }   // shrink font size on mobile
    }
  }}>
                <TableHead sx={{ position: 'sticky', top: 0, zIndex: 1, backgroundColor: '#24c6efff' }}>
                  <TableRow>
                    {/*<TableCell sx={{ color: 'white' }}><strong>Company</strong></TableCell>*/}
                    <TableCell sx={{ color: 'white' }}><strong>User</strong></TableCell>
                    <TableCell sx={{ color: 'white' }}><strong>Due Date</strong></TableCell>
                    <TableCell sx={{ color: 'white' }}><strong>Description</strong></TableCell>
                    <TableCell sx={{ color: 'white' }}><strong>Posted On</strong></TableCell>
                    <TableCell sx={{ color: 'white' }}><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {filteredAnnouncements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No announcements found for your company.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAnnouncements.map((a) => (
                      <TableRow key={a._id}>
                       {/*} <TableCell>{a.company}</TableCell>*/}
                        <TableCell sx={{backgroundColor:"white"}}>{a.user}</TableCell>
                        <TableCell  sx={{backgroundColor:"white"}}>{new Date(a.dueDate).toLocaleDateString()}</TableCell>
                        <TableCell  sx={{backgroundColor:"white"}}>{a.description}</TableCell>
                        <TableCell  sx={{backgroundColor:"white"}}>{new Date(a.createdAt).toLocaleString()}</TableCell>
                        <TableCell  sx={{backgroundColor:"white"}}>
                          {a.isRead ? (
                            <Button
                              size="small"
                              onClick={() => markAsRead(a._id)}
                              sx={{
                                backgroundColor: '#fecdc1',
                                color: 'black',
                                '&:hover': {
                                  backgroundColor: '#0056b3',
                                  borderColor: '#0056b3',
                                },
                              }}
                            >
                              Read
                            </Button>
                          ) : (
                            <Button
                              size="small"
                              onClick={() => markAsRead(a._id)}
                              sx={{
                                backgroundColor: '#24c6efff',
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: '#0056b3',
                                  borderColor: '#0056b3',
                                },
                              }}
                            >
                              Unread
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </Box>
      
  </Paper>
</Box>

      </Box>
    </>
  );
};

export default AdminNotifications;

