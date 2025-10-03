import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const EntrancePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        background: "#e6fbf9",
      }}
    >
      {/* Animated Accent Circles */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${180 + Math.random() * 150}px`,
            height: `${180 + Math.random() * 150}px`,
            borderRadius: "50%",
            background: i % 2 === 0 ? "rgba(36,198,239,0.15)" : "rgba(255,255,255,0.4)",
            filter: "blur(60px)",
          }}
          animate={{
            x: [0, 25, 0],
            y: [0, 35, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 16 + Math.random() * 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Logo with Subtle Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        style={{
          zIndex: 1,
          marginBottom: "1.5rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            p: 1.5,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 0 30px rgba(36,198,239,0.3)",
          }}
        >
          <motion.img
            src="/Images/logo8.png"
            alt="logo"
            height={150}
            width={150}
            style={{ borderRadius: "50%" }}
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </Box>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            mb: 2,
            fontSize: { xs: "2.2rem", md: "3rem" },
            background: "linear-gradient(90deg, #24c6ef, #0093E9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Welcome to Financio
        </Typography>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 4,
            color: "#4b6970",
            maxWidth: "500px",
            mx: "auto",
          }}
        >
          Your Smart Financial & Reporting Assistant
        </Typography>
      </motion.div>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <Button
          variant="contained"
          size="large"
          sx={{
            background: "linear-gradient(135deg, #24c6ef, #0093E9)",
            color: "white",
            px: 5,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1rem",
            borderRadius: "50px",
            boxShadow: "0 4px 20px rgba(36,198,239,0.4)",
            textTransform: "none",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 25px rgba(36,198,239,0.6)",
            },
          }}
          onClick={() => navigate("/EnterrPage")}
        >
          Let’s Get Started 🚀
        </Button>
      </motion.div>
    </Box>
  );
};

export default EntrancePage;

