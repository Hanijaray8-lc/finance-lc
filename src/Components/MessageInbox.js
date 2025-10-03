import React, { useState, useEffect } from "react";
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
import Navbar from "./Navbar";

const MessagesInbox = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.email || user?.username || user?.name;

  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    if (!username) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/emis/messages/${username}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [username]);

  return (
    <Box>
                <Navbar/>

    <Box
      sx={{
        minHeight: "90vh",
        bgcolor:'#cdebf3ff' ,
        p: { xs: 2, sm: 3, md: 4 }, // responsive padding
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        sx={{
          width: "100%",
          maxWidth: 1200,
          height:"80vh",
          borderRadius: 3,
          boxShadow: 4,
          p: { xs: 2, sm: 3 }, // responsive padding inside
          bgcolor: "#e6fbf9",
        }}
      >
        <Box sx={{display:"flex"}}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          size="small"
          sx={{
            mb: 2,
            backgroundColor: "#24c6efff",
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            px: { xs: 1.5, sm: 2 },
            py: 0.5,
            fontSize: { xs: "0.7rem", sm: "0.8rem" },
            "&:hover": {
              backgroundColor: "rgba(36,198,239,0.1)",
              color: "#24c6efff",
            },
          }}
        >
          Back
        </Button>

        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            mb: 3,
            textAlign: "center",
            color: "#24c6efff",
            fontSize: { xs: 18, sm: 22, md: 26 }, // responsive header font
            ml:{md:30,xs:2}
          }}
        >
          📩 Messages Inbox
        </Typography></Box>

        <List sx={{ maxHeight: "70vh", overflow: "auto" }}>
          {messages.length > 0 ? (
            messages.map((msg, idx) => {
              const createdAt = new Date(msg.createdAt);
              return (
                <React.Fragment key={idx}>
                  <ListItem
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      position: "relative",
                      py: { xs: 1.5, sm: 2 }, // responsive spacing
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
                        fontSize: { xs: "0.65rem", sm: "0.75rem" }, // smaller in mobile
                      }}
                    >
                      {createdAt.toLocaleDateString()}{" "}
                      {createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>

                    {/* 🔹 Main Message Content */}
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: "#333",
                        fontSize: { xs: "0.85rem", sm: "1rem", md: "1.1rem" }, 
                        mt:{md:0,xs:1}// responsive text size
                      }}
                    >
                      You have applied for a loan of{" "}
                      <span style={{ color: "#08970cff"}}>
                        ₹{msg.amount}
                      </span>
                      . Your monthly EMI is{" "}
                      <span style={{ color:  "#08970cff" }}>₹{msg.emi}</span>.
                    </Typography>
                  </ListItem>
                  <Divider />
                </React.Fragment>
              );
            })
          ) : (
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                color: "gray",
                mt: 5,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              No messages available 📭
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
        </Box>

  );
};

export default MessagesInbox;
