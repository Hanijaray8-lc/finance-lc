import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Box,
  Grid,
  Button,
  Paper,
  InputAdornment,
  Divider,
} from "@mui/material";
import axios from "axios";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import PercentIcon from "@mui/icons-material/Percent";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PersonIcon from "@mui/icons-material/Person";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const CalculateEMI = () => {
  const navigate = useNavigate();

  const [loanData, setLoanData] = useState({
    username: "",
    name: "",
    amount: "",
    interestRate: "",
    tenure: "",
    income: "",
  });
  const [emi, setEmi] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("emiApp");
    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.email || user?.username || user?.name;

    if (stored) {
      const data = JSON.parse(stored);
      setLoanData({
        username: username || "",
        name: data.name || "",
        amount: data.loanAmount || "",
        interestRate: data.interestRate,
        tenure: data.loanTenure || data.duration || "",
        income: data.monthlyIncome || data.income || "",
      });
    } else {
      setLoanData((prev) => ({ ...prev, username: username || "" }));
    }
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || user?.email || user?.name;

  const handleChange = (e) => {
    setLoanData({ ...loanData, [e.target.name]: e.target.value });
  };

  const handleCalculateEMI = () => {
    const { name, amount, interestRate, tenure, income } = loanData;

    if (!name || !amount || !interestRate || !tenure || !income) {
      alert("Please fill all fields.");
      return;
    }

    const P = parseFloat(amount);
    const annualRate = parseFloat(interestRate);
    const years = parseFloat(tenure);

    if (isNaN(P) || isNaN(annualRate) || isNaN(years)) {
      alert("Invalid input.");
      return;
    }

    const r = annualRate / 12 / 100;
    const n = years * 12;

    const emiCalc = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const emiFinal = emiCalc.toFixed(2);
    setEmi(emiFinal);
  };

  const handleSend = async () => {
    if (emi === null) {
      alert("Please calculate the EMI first.");
      return;
    }
    const { name, amount, interestRate, tenure, income } = loanData;
    const P = parseFloat(amount);
    const annualRate = parseFloat(interestRate);
    const years = parseFloat(tenure);

    try {
      await axios.post("http://localhost:5000/api/emis/save", {
        username,
        name,
        amount: P,
        interestRate: annualRate,
        tenure: years,
        income: parseFloat(income),
        emi: parseFloat(emi),
      });
      alert("EMI details successfully sent!");
      console.log("EMI details saved to DB");
    } catch (err) {
      console.error("Error saving EMI to backend:", err);
      alert("Failed to send EMI details.");
    }
  };

  return (
    <Box sx={{ background: "#cdebf3ff", height: "100vh" }}>
      <Container maxWidth="md" sx={{ py: 5, backgroundColor: "#cdebf3ff" }}>
        <Paper
          elevation={5}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            background: "#e6fbf9",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                color: "#24c6ef",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              Back
            </Button>
            <Typography
              variant="h4"
              sx={{
                flex: 1,
                textAlign: "center",
                color: "#24c6ef",
                fontWeight: "bold",
                fontSize: { md: 25, xs: 20 },
              }}
            >
              EMI Calculator
            </Typography>
          </Box>
          <Typography
            variant="body1"
            sx={{
              mb: 4,
              textAlign: "center",
              color: "gray",
              fontSize: { md: 18, xs: 12 },
            }}
          >
            Provide user loan details to calculate monthly EMI Amount
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={3} sx={{ ml: { md: "120px" } }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="name"
                label="Name"
                value={loanData.name}
                sx={{ width: { md: "250px", xs: "277px" } }}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="amount"
                label="Loan Amount"
                value={loanData.amount}
                onChange={handleChange}
                sx={{ width: { md: "250px", xs: "277px" } }}
                type="number"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CurrencyRupeeIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="interestRate"
                label="Interest Rate"
                value={loanData.interestRate}
                onChange={handleChange}
                sx={{ width: { md: "250px", xs: "277px" } }}
                type="number"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <PercentIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                name="tenure"
                label="Tenure (Years)"
                value={loanData.tenure}
                onChange={handleChange}
                sx={{ width: { md: "250px", xs: "277px" } }}
                type="number"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                name="income"
                label="Monthly Income"
                value={loanData.income}
                onChange={handleChange}
                sx={{  width: { md: "525px", xs: "277px" } }}
                type="number"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MonetizationOnIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              textAlign: "center",
              mt: 4,
              display: "flex",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={handleCalculateEMI}
              sx={{
                backgroundColor: "#24c6ef",
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 3,
                "&:hover": { backgroundColor: "#1aa7ce" },
              }}
            >
              Calculate EMI
            </Button>
            {emi && (
              <Button
                variant="outlined"
                onClick={handleSend}
                sx={{
                    backgroundColor: "#24c6ef",
                px: {md:8,xs:6},
                color:"white",
                py: 1.5,
                border:"none",
                fontWeight: "bold",
                borderRadius: 3,
                "&:hover": { backgroundColor: "#1aa7ce" },
                }}
              >
                Send
              </Button>
            )}
          </Box>

          {emi && (
            <Paper
              elevation={3}
              sx={{
                mt: 4,
                p: 3,
                textAlign: "center",
                background: "white",
                border: "2px solid #24c6ef",
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" sx={{ color: "#24c6ef", fontWeight: "bold" }}>
                Monthly EMI: ₹{emi}
              </Typography>
            </Paper>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CalculateEMI;

