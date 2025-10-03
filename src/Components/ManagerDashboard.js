import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Grid,
  Box,
  AppBar,
  Toolbar,
  Button,
  IconButton,
   Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import AdminUserManagement from "./AdminUserManagement";
import { useNavigate } from "react-router-dom";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";

export default function ManagerDashboard() {
  const [count, setCount] = useState(0);
  const [financecount, setFinanceCount] = useState(0);
  const [approved, setApproved] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);
  const navigate = useNavigate();

  // 🔹 Fetch total users
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/users/count")
      .then((res) => setCount(res.data.totalUsers))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Fetch total finance companies
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/financeCompanies/count")
      .then((res) => setFinanceCount(res.data.totalCompanies))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Fetch approved/rejected counts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/financeCompanies/status-counts")
      .then((res) => {
        setApproved(res.data.approvedCount);
        setRejected(res.data.rejectedCount);
      })
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Fetch company-wise application counts
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/financecompanies")
      .then(async (res) => {
        const fetchedCompanies = res.data;

        const companiesWithCounts = await Promise.all(
          fetchedCompanies.map(async (company) => {
            try {
              const countRes = await axios.get(
                `http://localhost:5000/api/loan/company/${company.companyId}/application-count`
              );
              return {
                ...company,
                users: countRes.data.applicationCount || 0
              };
            } catch (err) {
              console.error(err);
              return { ...company, users: 0 };
            }
          })
        );

        setCompanies(companiesWithCounts);
        setTotalUsers(
          companiesWithCounts.reduce((sum, c) => sum + c.users, 0)
        );
      })
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  // Navigation functions
  const handleRegistrationForm = () => {
    navigate("/AdminRegister");
  };

  const handleManagerPanel = () => {
    navigate("/ManagerPanel");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  const isMobile = useMediaQuery("(max-width:600px)");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 🔹 Top Navigation Bar */}
        <AppBar position="static" sx={{ backgroundColor: "#24c6ef" }}>
      <Toolbar>
        {/* Title */}
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontSize: 24, fontWeight: "bold" }}
        >
          Manager Dashboard
        </Typography>

        {/* Desktop buttons */}
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              onClick={handleRegistrationForm}
              sx={{
                backgroundColor: "white",
                color: "#24c6ef",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Registration Form
            </Button>

            <Button
              onClick={handleManagerPanel}
              sx={{
                backgroundColor: "white",
                color: "#24c6ef",
                "&:hover": { backgroundColor: "#f5f5f5" },
              }}
            >
              Manager Panel
            </Button>

            <IconButton onClick={() => navigate("/Manager")} sx={{ color: "white" }}>
              <LoginIcon fontSize="large" />
            </IconButton>

            <IconButton onClick={handleLogout} sx={{ color: "white" }}>
              <LogoutIcon fontSize="large" />
            </IconButton>
          </Box>
        )}

        {/* Mobile hamburger menu */}
        {isMobile && (
          <>
            <IconButton onClick={handleMenuOpen} sx={{ color: "white" }}>
              <MenuIcon fontSize="large" />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => { handleRegistrationForm(); handleMenuClose(); }}>
                Registration Form
              </MenuItem>
              <MenuItem onClick={() => { handleManagerPanel(); handleMenuClose(); }}>
                Manager Panel
              </MenuItem>
              <MenuItem onClick={() => { navigate("/Manager"); handleMenuClose(); }}>
                <LoginIcon sx={{ mr: 1 }} /> Login
              </MenuItem>
              <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>
                <LogoutIcon sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </>
        )}
      </Toolbar>
    </AppBar>

      {/* 🔹 Main Content */}
      <Box>
        <Box
          sx={{
            p: 3,
            backgroundImage: "linear-gradient(to bottom right, #cdebf3ff, #aae3f0ff)"
          }}
        >
          {/* 🔹 Top Stats */}

<Box sx={{ flexGrow: 1, mb: 4 }}>
  <Grid container spacing={2}>
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ p: 2, background: "#e6fbf9", textAlign: "center" ,width:{xs:"280px",md:"322px"}}}>
        <Typography variant="h6">Total Users</Typography>
        <Typography variant="h4">{count}</Typography>
      </Card>
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ p: 2, background: "#e6fbf9", textAlign: "center",width:{xs:"280px",md:"322px"} }}>
        <Typography variant="h6">Total Finance Companies</Typography>
        <Typography variant="h4">{financecount}</Typography>
      </Card>
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ p: 2, background: "#e6fbf9", textAlign: "center" ,width:{xs:"280px",md:"322px"}}}>
        <Typography variant="h6">Approved Companies</Typography>
        <Typography variant="h4">{approved}</Typography>
      </Card>
    </Grid>

    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ p: 2, background: "#e6fbf9", textAlign: "center",width:{xs:"280px",md:"322px"} }}>
        <Typography variant="h6">Rejected Companies</Typography>
        <Typography variant="h4">{rejected}</Typography>
      </Card>
    </Grid>
  </Grid>
</Box>


          {/* 🔹 Main Grid Layout */}
          <Grid container spacing={3}>
            {/* 1️⃣ AdminUserManagement Table */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  height: { xs: "auto", md: "71vh" },
                  width: "100%",
                  background: "#e6fbf9"
                }}
              >
                <CardContent>
                  <AdminUserManagement />
                </CardContent>
              </Card>
            </Grid>

            {/* 2️⃣ Company-wise List */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  height: { xs: "auto", md: "71vh" },
                  width: "100%",
                  background: "#e6fbf9"
                }}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, color: "#24c6efff" }}>
                    Company-wise Applied User Distribution
                  </Typography>
                  <Paper elevation={0} sx={{ maxHeight: 500, overflow: "auto" }}>
                    {companies.map((company) => (
                      <Accordion
                        key={company.companyId}
                        expanded={expanded === company.companyId}
                        onChange={handleChange(company.companyId)}
                        sx={{ mb: 1 }}
                      >
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Typography sx={{ fontWeight: "bold" }}>
                            {company.name}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <List dense>
                            <ListItem>
                              <ListItemText
                                primary="Applied Users Count"
                                secondary={company.users.toLocaleString()}
                              />
                            </ListItem>
                            <Divider />
                            <ListItem>
                              <ListItemText
                                primary="Percentage"
                                secondary={`${(
                                  (company.users / totalUsers) *
                                  100
                                ).toFixed(1)}%`}
                              />
                            </ListItem>
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Paper>
                </CardContent>
              </Card>
            </Grid>

            {/* 3️⃣ Company-wise Chart */}
            <Grid item xs={12} md={4}>
              <Card
                elevation={3}
                sx={{
                  height: { xs: "auto", md: "71vh" },
                  width: "100%",
                  background: "#e6fbf9"
                }}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ mb: 3, color: "#24c6efff" }}>
                    Applied User Distribution Chart
                  </Typography>
                  <Box sx={{ height: { xs: 300, sm: 400 } }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={companies}
                        margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-30}
                          textAnchor="end"
                          height={60}
                          tick={{ fontSize: 11 }}
                        />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="users"
                          name="Applied Users"
                          fill="#1976d2"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}

