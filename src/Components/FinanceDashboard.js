import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Card,
  CardContent,
  Divider,
  Button,
  Avatar,
    IconButton,
  LinearProgress,
  styled
} from '@mui/material';
import {
  People as PeopleIcon,
  MonetizationOn as LoanIcon,
  CheckCircle as ApprovedIcon,
  Cancel as RejectedIcon,
  AccessTime as PendingIcon,
  Announcement as AnnouncementIcon,
  Feedback as FeedbackIcon
} from '@mui/icons-material';
import axios from 'axios';
import AdminSidebar from './Adminsidebar';
import CompanyProductTable from './CompanyProductTable';
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
// Styled components
const StatCard = styled(Card)(({ theme }) => ({
  minHeight: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s',
  '&:hover': {
    transform: 'scale(1.03)'
  }
}));

const FinanceAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalApplications: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    unreadNotifications: 0,
    recentFeedbacks: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const companyName = localStorage.getItem('companyName') || 'Your Company';
  const [applications, setApplications] = useState([]);
  const topApplication = [...applications].sort((a, b) => b.loanAmount - a.loanAmount)[0];
  const navigate = useNavigate();


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const companyId = localStorage.getItem('companyId');
        
        // Fetch all data in parallel
        const [appsRes, notifsRes, feedbacksRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/loan/company/${companyId}`),
          axios.get('http://localhost:5000/api/admin/Notification'),
          axios.get('http://localhost:5000/api/feedback')
        ]);

        const applications = appsRes.data;
        const notifications = notifsRes.data;
        const feedbacks = feedbacksRes.data;

        // Calculate stats
        const approved = applications.filter(app => app.status === 'Approved').length;
        const pending = applications.filter(app => !app.status || app.status === 'Pending').length;
        const rejected = applications.filter(app => app.status === 'Rejected').length;
        const unreadNotifs = notifications.filter(n => !n.isRead).length;
        const companyFeedbacks = feedbacks.filter(fb => fb.FinancecompanyName === companyName).length;

        setStats({
          totalApplications: applications.length,
          approved,
          pending,
          rejected,
          unreadNotifications: unreadNotifs,
          recentFeedbacks: companyFeedbacks
        });

        // Get recent 5 applications
        setRecentApplications(applications.slice(0, 5));
        setLoading(false);
      } catch (err) {
        console.error('Dashboard data error:', err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [companyName]);

   useEffect(() => {
  axios.get('http://localhost:5000/api/loan/all')
    .then(res => {
      setApplications(res.data);
    })
    .catch(err => {
      console.error('Error fetching applications:', err);
    });
}, []);


  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <LinearProgress sx={{ width: '50%' }} />
      </Box>
    );
  }

    const handleLogout = () => {
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");
    navigate("/CompanyLogin");
  };

  const handleLogin = () => {
    navigate("/CompanyLogin");
  };

  const handleBack = () => {
    navigate(-1); // go back to previous page
  };




  return (
    <>
      <AdminSidebar />
      <Box sx={{ 
      background:'#cdebf3ff' ,
        minHeight: '100vh',
        ml: {md:'240px',xs:0},
        p: {md:3,xs:1}
      }}>
        <Container maxWidth="xl">
          <Box
      sx={{
        mb: { md: 4, xs: 2 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: "#3498db",
            width: { md: 56, xs: 40 },
            height: { md: 56, xs: 40 },
          }}
        >
          {companyName.charAt(0)}
        </Avatar>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#2c3e50",
            fontSize: { md: 30, xs: 18 },
          }}
        >
          {companyName} Dashboard
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap:{md:1,xs:3},px:{xs:4,md:0}  }}>
        <Button onClick={handleBack} sx={{ color: "white",backgroundColor:"#24c6efff" }}>
Back        </Button>
        <Button onClick={handleLogin} sx={{ color:"white",backgroundColor: "#24c6efff" }}>
Login        </Button>
        <Button onClick={handleLogout} sx={{ color: "white",backgroundColor:"#24c6efff" }}>
     Logout
        </Button>
      </Box>
    </Box>

          <Grid container spacing={{ xs: 1, sm: 2, md: 3 }}sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard sx={{width:{md:"175px",xs:"149px"},background:'#e6fbf9'}}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1,ml:{md:5,xs:2} }}>
                    <LoanIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" component="div" sx={{textAlign:"center"}}>
                      {stats.totalApplications}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{textAlign:"center",fontSize:{md:15,xs:12}}}>
                    Total Applications
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard sx={{width:{md:"175px",xs:"149px"},background:'#e6fbf9'}}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 ,ml:{md:5,xs:2}}}>
                    <ApprovedIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" component="div">
                      {stats.approved}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{textAlign:"center",fontSize:{md:15,xs:12}}}>
                    Approved
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard sx={{width:{md:"175px",xs:"149px"},background:'#e6fbf9'}}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1,ml:{md:5,xs:2} }}>
                    <PendingIcon color="warning" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" component="div">
                      {stats.pending}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{textAlign:"center",fontSize:{md:15,xs:12}}}>
                    Pending
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard sx={{width:{md:"175px",xs:"149px"},background:'#e6fbf9'}}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 ,ml:{md:5,xs:2}}}>
                    <RejectedIcon color="error" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" component="div">
                      {stats.rejected}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{textAlign:"center",fontSize:{md:15,xs:12}}}>
                    Rejected
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard sx={{width:{md:"175px",xs:"149px"},background:'#e6fbf9'}}  >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 ,ml:{md:5,xs:2}}}>
                    <AnnouncementIcon color="action" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" component="div">
                      {stats.unreadNotifications}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{textAlign:"center",fontSize:{md:15,xs:12}}}>
                    Unread Alerts
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>

            <Grid item xs={12} sm={6} md={4} lg={2}>
              <StatCard sx={{width:{md:"175px",xs:"149px"},background:'#e6fbf9'}}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 ,ml:{md:5,xs:2}}}>
                    <FeedbackIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h5" component="div">
                      {stats.recentFeedbacks}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{textAlign:"center",fontSize:{md:15,xs:12}}}>
                    Customer Feedbacks
                  </Typography>
                </CardContent>
              </StatCard>
            </Grid>
          </Grid>

       <Grid container spacing={3}>
      
  {/* Recent Applications */}
  <Grid item xs={12} md={4} sx={{ width: "305px", background: '#e6fbf9',height:"20vh" }}>
  <Paper sx={{ p: 2, height: '60vh', display: 'flex', flexDirection: 'column', background: '#e6fbf9' }}>
    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h6" fontWeight="bold" sx={{ fontSize: 15 }}>
        Recent Loan Applications
      </Typography>
      <Button variant="outlined" size="small" href="/ApplicationReports"  sx={{background:'  #24c6efff',color:'white'}}>
        View All
      </Button>
    </Box>
    <Divider sx={{ mb: 2 }} />
    
    {/* Scrollable List */}
    <Box sx={{ flexGrow: 1, overflowY: 'auto', minHeight: '180px' }}>
      {recentApplications.length > 0 ? (
        recentApplications.map((app) => (
          <Box
            key={app._id}
            sx={{
              p: 2,
              mb: 1,
              borderRadius: 1,
              backgroundColor: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">{app.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {app.loanType} • ₹{app.loanAmount}
              </Typography>
            </Box>
            <Typography
              variant="caption"
              sx={{
                p: 0.5,
                borderRadius: 1,
                bgcolor:
                  app.status === 'Approved' ? '#d4edda' :
                  app.status === 'Rejected' ? '#f8d7da' : '#fff3cd',
                color:
                  app.status === 'Approved' ? '#155724' :
                  app.status === 'Rejected' ? '#721c24' : '#856404',
              }}
            >
              {app.status || 'Pending'}
            </Typography>
          </Box>

          
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 3 }}>
          No recent applications found
        </Typography>
      )}
    </Box>
      {topApplication && (
<Paper elevation={3} sx={{ mb: 3, p: 3, borderRadius: 2, background: 'white',mt:2 }}>
  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#33691e',fontSize:15 }}>
    🏆 Top Loan Application
  </Typography>
  <Box sx={{ mt: 1 }}>
    <Typography><strong>Name:</strong> {topApplication.name}</Typography>
    <Typography><strong>Loan Type:</strong> {topApplication.loanType}</Typography>
    <Typography><strong>Loan Amount:</strong> ₹{topApplication.loanAmount}</Typography>
  </Box>
</Paper>

)}
     
  </Paper>
 
</Grid>

  {/* Offers / Products */}
  <Grid item xs={12} md={4}>
    <Paper sx={{ p: 1, maxHeight:'62vh', display: 'flex', flexDirection: 'column',background:'#e6fbf9',mt:{xs:39,md:0} }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2,fontSize: 15 }} gutterBottom>
             Offers for {companyName}
           </Typography>
            <Divider sx={{ mb:{md:2,xs:0}  }} />
      <Box sx={{ flexGrow: 1, overflowY: 'auto',width:{md:"500px",xs:"300px" },maxHeight:"60vh"}}>
        <CompanyProductTable />
      </Box>
    </Paper>
  </Grid>

  {/* Quick Actions */}
  <Grid item xs={12} md={4} sx={{width:"305px",}}>
    <Paper sx={{ p: 2, height: '60vh',  display: 'flex', flexDirection: 'column',background:'#e6fbf9' }}>
      <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 ,fontSize: 15}}>Quick Actions</Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6}>
          <Button fullWidth variant="contained" href="/ApplicationReports" sx={{ py: 2,width:"270px",backgroundColor:'  #24c6efff' }}>
            Manage Loans
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button fullWidth variant="contained"  href="/AddProduct" sx={{ py: 2,width:"270px",backgroundColor:'  #24c6efff' }}>
            Add Loan Offers
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            sx={{ py: 2,width:"270px", backgroundColor: '  #24c6efff', '&:hover': { backgroundColor: '#e68a00' ,} }}
            href="/AdminNotificationForm"
          >
            Send Alerts
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            fullWidth
            variant="contained"
            sx={{ py: 2,width:"270px", backgroundColor: '  #24c6efff', '&:hover': { backgroundColor: '#3d8b40', } }}
            href="/FeedbackList"
          >
            View Feedbacks
          </Button>
        </Grid>
      </Grid>
      <Divider sx={{ mb: 2 }} />
      <Box>
        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
          Approval Rate
        </Typography>
        <LinearProgress
          variant="determinate"
          value={stats.totalApplications > 0 ? (stats.approved / stats.totalApplications) * 100 : 0}
          sx={{ height: 10, borderRadius: 5, mb: 1 }}
        />
        <Typography variant="body2" color="text.secondary">
          {stats.approved} out of {stats.totalApplications} applications approved
        </Typography>
      </Box>
    </Paper>
  </Grid>
</Grid>

        </Container>
      </Box>
    </>
  );
};

export default FinanceAdminDashboard;
