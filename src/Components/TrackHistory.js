import React from "react";
import {
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const HistoryDashboard = () => {
  const navigate = useNavigate();

  const items = [
    { title: "Loan Payment History", path: "/UserLoanHistry" },
    { title: "Notification / Due History", path: "/NotificationHistory" },
    { title: "Messages History", path: "/MessageInbox" },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#e6fbf9",
        p: 3,
      }}
    >
      {/* 🔙 Back Button at Top-Left Corner */}
      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 3,
            bgcolor: "#24c6efff",
            color: "white",
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: "8px",
            px: 2,
            "&:hover": { bgcolor: "#00a7d7" },
          }}
        >
          Back
        </Button>
      </Box>

      {/* Title */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 4,
          textAlign: "center",
          color: "#24c6efff",
          mt:{md:20,xs:0}
        }}
      >
        History Dashboard
      </Typography>

      {/* Cards */}
      <Grid container spacing={4} justifyContent="center">
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                borderRadius: "16px",
                bgcolor: "#24c6efff",
                height: 150,
                width: "250px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0px 6px 15px rgba(0,0,0,0.15)",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-6px) scale(1.05)",
                  boxShadow: "0px 12px 30px rgba(36,198,239,0.5)",
                  background: "linear-gradient(135deg,#24c6ef,#00b2ff)",
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(item.path)}
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      fontSize: "1.1rem",
                      color: "white",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {item.title}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default HistoryDashboard;

