import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Popover,
  Badge,
  List,
  ListItem,
  ListItemText,
  Divider,
  Drawer,
  ListItemButton,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EMessage from './EMessage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const username = user?.username || user?.name || user?.email;
  const profilePhoto = user?.profilePhoto
    ? `http://localhost:5000/uploads/${user.profilePhoto}`
    : '/Images/defaultProfile.png';

  // -------- Fetch Notifications --------
  const fetchNotifications = async () => {
    if (!username) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/Notification/${username}`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter(note => !note.isRead).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markNotificationsAsRead = async () => {
    if (!username) return;
    try {
      await axios.post(`http://localhost:5000/api/admin/Notification/mark-as-read/${username}`);
      fetchNotifications();
    } catch (err) {
      console.error('Error marking notifications as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000);
    return () => clearInterval(interval);
  }, [username]);

  // -------- Handlers --------
  const handleLogout = () => {
    localStorage.clear();
    navigate('/userlogin');
  };

  const handleProfileClick = () => {
    navigate('/userprofilePage');
  };

  const handleBellClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const notifOpen = Boolean(anchorEl);

  return (
    <AppBar position="static" sx={{ backgroundColor: '#24c6efff' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <img src="/Images/logo2.png" alt='logo2' style={{ width: '70px', height: '45px' }} />
          <span style={{ fontWeight: 'bold', fontFamily: 'sans-serif', color: 'white' }}>
            Finan<span style={{ color: '#fecdc1' }}>cio</span>
          </span>
        </Typography>

        {/* Desktop Menu */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button color="inherit" href="/Home">Dashboard</Button>
            <Button color="inherit" href="/AllFinanci">Services</Button>

            {token ? (
              <>
                {/* Profile */}
                <IconButton onClick={handleProfileClick}>
                  <Avatar alt="Profile Photo" src={profilePhoto} />
                </IconButton>

                {/* Notifications */}
                <IconButton color="inherit" onClick={handleBellClick}>
                  <Badge badgeContent={unreadCount} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* Notification Popover */}
                <Popover
                  open={notifOpen}
                  onClose={handlePopoverClose}
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                  PaperProps={{
                    sx: {
                      width: 350,
                      maxHeight: 400,
                      overflow: 'auto',
                      borderRadius: 2,
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box sx={{ p: 2, bgcolor: '#24c6efff', color: 'white', fontWeight: 'bold' }}>
                    Notifications
                  </Box>
                  <List sx={{ p: 1 }}>
                    {notifications.length > 0 ? (
                      notifications.map((note, idx) => (
                        <ListItem
                          key={idx}
                          divider
                          sx={{
                            backgroundColor: note.isRead ? '#fff' : '#e0f7fa',
                            borderRadius: 1,
                            mb: 1,
                            px: 2,
                            py: 1.5,
                          }}
                        >
                          <ListItemText
                            primary={note.description}
                            secondary={
                              <>
                                <Typography variant="body2"><strong>Company:</strong> {note.company}</Typography>
                                <Typography variant="body2"><strong>Due:</strong> {new Date(note.dueDate).toLocaleDateString()}</Typography>
                              </>
                            }
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No notifications" />
                      </ListItem>
                    )}
                  </List>
                </Popover>

                <EMessage />

                <Button color="inherit" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <Button color="inherit" href="/userlogin">Login</Button>
            )}
          </Box>
        )}

        {/* Mobile Menu */}
        {isMobile && (
          <Box>
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: 'white' }}>
              <MenuIcon />
            </IconButton>
            <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
              <Box sx={{ width: 250, p: 2, bgcolor: '#e6fbf9', height: '100%' }}>
                <List>
                  <ListItemButton component="a" href="/Home"> <ListItemText primary="Dashboard" /> </ListItemButton>
                  <ListItemButton component="a" href="/AllFinanci"> <ListItemText primary="Services" /> </ListItemButton>
                  <Divider sx={{ my: 1 }} />
                  {token ? (
                    <>
                      <ListItemButton onClick={handleProfileClick}>
                        <Avatar alt="Profile" src={profilePhoto} sx={{ mr: 1 }} />
                        <ListItemText primary="Profile" />
                      </ListItemButton>
                      <ListItemButton onClick={handleBellClick}>
                        <Badge badgeContent={unreadCount} color="error">
                          <NotificationsIcon />
                        </Badge>
                        <ListItemText primary="Notifications" sx={{ ml: 1 }} />
                      </ListItemButton>
                      <EMessage />
                      <ListItemButton onClick={handleLogout}><ListItemText primary="Logout" /></ListItemButton>
                    </>
                  ) : (
                    <ListItemButton component="a" href="/userlogin">
                      <ListItemText primary="Login" />
                    </ListItemButton>
                  )}
                </List>
              </Box>
            </Drawer>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;



