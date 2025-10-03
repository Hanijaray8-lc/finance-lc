import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

function UserNotifications({ userId }) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/user/notifications/${userId}`).then((res) => {
      setNotifications(res.data);
    });
  }, [userId]);

  return (
    <div>
      <h3>Your Notifications</h3>
      <List>
        {notifications.map((n) => (
          <ListItem key={n._id}>
            <ListItemText primary={n.message} secondary={new Date(n.date).toLocaleString()} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default UserNotifications;
