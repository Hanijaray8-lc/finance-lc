import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import axios from 'axios';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
const handleOpen = (event) => {
  setAnchorEl(event.currentTarget);
  setUnreadCount(0); // Optimistically update

  axios.put('http://localhost:5000/api/sms/replies/mark-read')
    .catch(err => console.error('Failed to mark messages as read:', err));
};


  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'message-popover' : undefined;



useEffect(() => {
  // Load messages
  axios.get('http://localhost:5000/api/sms/replies')
    .then(res => setMessages(res.data))
    .catch(err => console.error(err));

  // Fetch unread count
  axios.get('http://localhost:5000/api/sms/replies/unread/count')
    .then(res => setUnreadCount(res.data.count))
    .catch(err => console.error(err));
}, []);



  return (
    <AppBar position="static" sx={{ background: '#24c6ef' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Manager Panel
        </Typography>

        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={unreadCount} color="error">
            <MessageIcon />
          </Badge>
        </IconButton>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <List sx={{ width: 300 }}>
            {messages.length === 0 ? (
              <ListItem>
                <ListItemText primary="No new messages" />
              </ListItem>
            ) : (
              messages.map((msg, index) => (
                <ListItem key={index} divider>
                 <ListItemText
  primary={`From: ${msg.from}`}
  secondary={msg.message}
/>

                </ListItem>
              ))
            )}
          </List>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
