import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Paper,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || user?.name || user?.email;
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);

  const fetchNotifications = async () => {
    if (!username) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/Notification/${username}`
      );
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [username]);

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: '#cdebf3ff' }}>
      {/* 🔙 Back Button */}
      <Box sx={{display:'flex'}}>
    <Button
  startIcon={<ArrowBackIcon />}
  onClick={() => navigate(-1)}
  size="small"   // ✅ smaller button for mobile
  sx={{
    mb: 2,
    backgroundColor: "#24c6efff",
    color: "white",
    fontWeight: "bold",
    textTransform: "none",
    px: 2,  // padding horizontal small
    py: 0.5, // padding vertical small
    fontSize: "0.85rem", // smaller font
    "&:hover": { backgroundColor: "rgba(36,198,239,0.1)", color: "#24c6efff" },
  }}
>
  Back
</Button>


      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          mb: 3,
          fontSize: { xs: 16, sm: 20, md: 28 },
          color: "#24c6efff",
          textAlign: "center",
          ml:{md:60,xs:1}
        }}
      >
        Notification History for {username}
      </Typography></Box>

      {notifications.length > 0 ? (
       <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
  <List
    sx={{
      maxHeight: "700px", // 🔹 Set max height
      overflowY: "auto",  // 🔹 Enable vertical scrollbar
    }}
  >
    {notifications.map((note, idx) => {
      const createdAt = new Date(note.createdAt);
      return (
        <React.Fragment key={idx}>
          <ListItem
            sx={{
              backgroundColor: note.isRead ? "#e6fbf9" : "#fff",
              px: 2,
              py: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              position: "relative",
            }}
          >
            {/* 🔹 Date & Time Top Right */}
            <Typography
              variant="caption"
              sx={{
                position: "absolute",
                top: 8,
                right: 12,
                color: "#24c6efff",
                fontWeight: "bold",
                fontSize: "0.8rem",
              }}
            >
              {createdAt.toLocaleDateString()}{" "}
              {createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>

            {/* 🔹 Main Content */}
            <Typography
              sx={{
                color: "#24c6efff",
                fontWeight: 600,
                fontSize: "1rem",
                mb: 0.5,
              }}
            >
              {note.description}
            </Typography>
            <Typography variant="body2">
              <strong>Company:</strong> {note.company}
            </Typography>
            <Typography variant="body2">
              <strong>Due:</strong>{" "}
              {new Date(note.dueDate).toLocaleDateString()}
            </Typography>
          </ListItem>
          <Divider />
        </React.Fragment>
      );
    })}
  </List>
</Paper>

      ) : (
        <Typography sx={{ textAlign: "center", mt: 4, color: "gray" }}>
          No notifications available.
        </Typography>
      )}
    </Box>
  );
};

export default NotificationsPage;
