import React, { useState, useEffect } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Tooltip,
  Typography,
  Box
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import axios from 'axios';

const MessageNotification = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const username = user?.email || user?.username || user?.name;

  const [messageAnchorEl, setMessageAnchorEl] = useState(null);
  const [messages, setMessages] = useState([]);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const fetchMessages = async () => {
    if (!username) return;
    try {
      const res = await axios.get(`http://localhost:5000/api/emis/messages/${username}`);
      setMessages(res.data);
      const unread = res.data.filter((msg) => !msg.isRead).length;
      setUnreadMessagesCount(unread);
    } catch (err) {
      console.error("Error fetching EMI messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 30000);
    return () => clearInterval(interval);
  }, [username]);

  const isMessageOpen = Boolean(messageAnchorEl);

  const handleMessageClick = async (event) => {
    setMessageAnchorEl(event.currentTarget);
    await fetchMessages();
    try {
      await axios.post(
        `http://localhost:5000/api/emis/messages/mark-as-read/${username}`
      );
      setUnreadMessagesCount(0);
    } catch (err) {
      console.error("Error marking messages as read", err);
    }
  };

  const handleMessageClose = () => {
    setMessageAnchorEl(null);
  };

  return (
    <>
      <Tooltip title="Messages">
        <IconButton color="inherit" onClick={handleMessageClick}>
          <Badge badgeContent={unreadMessagesCount} color="error">
            <MessageIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={isMessageOpen}
        onClose={handleMessageClose}
        anchorEl={messageAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <List sx={{ width: 320, maxHeight: 400, overflow: "auto" }}>
          {messages.length > 0 ? (
            messages.map((msg, idx) => (
              <ListItem key={idx} divider sx={{ textAlign: "center" }}>
                <ListItemText
                  primary={
                    <Typography variant="body1" fontWeight="bold" color="primary">
                      For your loan of ₹{msg.amount},  
                      your EMI is ₹{msg.emi}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {new Date(msg.createdAt).toLocaleString()}
                    </Typography>
                  }
                />
              </ListItem>
            ))
          ) : (
            <ListItem sx={{ textAlign: "center" }}>
              <ListItemText primary="No EMI messages" />
            </ListItem>
          )}
        </List>
      </Popover>
    </>
  );
};

export default MessageNotification;
