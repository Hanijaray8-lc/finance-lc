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
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Security,
  Person,
  ArrowBack,
} from "@mui/icons-material"; // Added ArrowBack icon

const roles = [
  {
    title: "Admin",
    icon: <Security sx={{ fontSize: 50 }} />,
    description: "Login as admin to oversee the entire platform.",
    path: "/CompanyLogin",
    color: "#e6fbf9",
  },
  {
    title: "User",
    icon: <Person sx={{ fontSize: 50 }} />,
    description: "Login as user to view reports and submit feedback.",
    path: "/UserRegister",
    color: "#e6fbf9",
  },
];

const SelectLoginRole = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(120deg, #0f172a, #1e293b)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        position: "relative", // Needed for absolute positioning
      }}
    >
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)} // Goes to previous page
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          color: "#24c6ef",
                    background:  "#e6fbf9",

          "&:hover": { background: "rgba(255,255,255,0.2)" },
        }}
      >
     Back
      </Button>

      <Box
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          maxWidth: 1000,
          width: "100%",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          fontWeight="bold"
          sx={{
            background: "linear-gradient(90deg, #24c6ef, #0093E9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 4,
          }}
        >
          Select Your{" "}
          <Box
            component="span"
            sx={{
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate("/manager")}
          >
            Login
          </Box>{" "}
          Role
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {roles.map((role, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  sx={{
                    borderRadius: 3,
                    background: role.color,
                    color: "white",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
                    minWidth: { xs: "250px", sm: "300px", md: "400px" }, // responsive
                  }}
                >
                  <CardActionArea onClick={() => navigate(role.path)}>
                    <CardContent sx={{ py: 4, color: "#24c6efff" }}>
                      {role.icon}
                      <Typography
                        variant="h5"
                        align="center"
                        gutterBottom
                        sx={{ mt: 1 }}
                      >
                        {role.title}
                      </Typography>
                      <Typography variant="body2" align="center">
                        {role.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default SelectLoginRole;
