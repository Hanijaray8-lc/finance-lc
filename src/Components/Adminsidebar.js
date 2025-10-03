import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  IconButton,
  Box,
  useTheme,
  useMediaQuery
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import FeedbackIcon from '@mui/icons-material/Feedback';
import HomeIcon from '@mui/icons-material/Home';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useNavigate } from 'react-router-dom';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


const drawerWidth = 240;

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/FinanceDashboard' },
    { text: 'Loan Applications', icon: <DescriptionIcon />, path: '/ApplicationReports' },
    { text: 'Product Offers', icon: <LocalOfferIcon />, path: '/AddProduct' },
    {text:'Notification& Due alerts', icon:<EventNoteIcon/>,path:'/AdminNotificationForm'},
    { text: 'Feedbacks', icon: <FeedbackIcon />, path: '/FeedbackList' },
    {text:'Payment History',icon:<FeedbackIcon />, path: '/LoanHistryForm'},
  ];

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

   const goToProfile = () => {
    navigate('/CompanyProfilePage'); // Change to your profile route
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <Box sx={{ position: 'fixed', top: 10, left: 10, zIndex: theme.zIndex.drawer + 1 }}>
          <IconButton
            color="inherit"
            onClick={handleDrawerToggle}
            sx={{ 
              color: '#24c6efff', 
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'white',
                opacity: 0.9
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      )}
<Drawer
  variant={isMobile ? 'temporary' : 'permanent'}
  open={open}
  onClose={handleDrawerToggle}
  sx={{
    width: open ? drawerWidth : 60, // collapsed width when closed
    flexShrink: 0,
    whiteSpace: 'nowrap',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: open
        ? theme.transitions.duration.enteringScreen
        : theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    [`& .MuiDrawer-paper`]: {
      width: open ? drawerWidth : 60,
      boxSizing: 'border-box',
      background: '#24c6efff',
      color: 'white',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: open
          ? theme.transitions.duration.enteringScreen
          : theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
    },
  }}
>

        <Toolbar sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          backgroundColor: '#1e9fc7',
          minHeight: '64px !important'
        }}>
          {open && (
              <Box display="flex" alignItems="center">
                <IconButton color="inherit" onClick={goToProfile}>
        <AccountCircleIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div" sx={{ mr: 2 }}>
        Admin Panel
      </Typography>
      
    </Box>
             
          )}
          <IconButton 
            onClick={handleDrawerToggle} 
            sx={{ 
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.3)'
              }
            }}
          >
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Toolbar>
        <List>
          {menuItems.map((item, index) => (
            <ListItem
              button
              key={item.text}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setOpen(false);
              }}
              onMouseEnter={() => setHoveredItem(index)}
              onMouseLeave={() => setHoveredItem(null)}
              sx={{
                py: 1.5,
                backgroundColor: hoveredItem === index ? 'white' : 'transparent',
                color: hoveredItem === index ? '#24c6efff' : 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'white',
                  color: '#24c6efff'
                },
                justifyContent: open ? 'flex-start' : 'center',
                px: open ? 3 : 2,
              }}
            >
              <ListItemIcon sx={{ 
                color: hoveredItem === index ? '#24c6efff' : 'white',
                minWidth: 'auto',
                mr: open ? 3 : 'auto',
                transition: 'all 0.3s ease',
              }}>
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary={item.text} 
                  primaryTypographyProps={{ 
                    fontWeight: 'medium',
                    fontSize: '0.95rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default AdminSidebar;

