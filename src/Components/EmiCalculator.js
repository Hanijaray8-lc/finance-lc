import React, { useState } from 'react';
import { Box, Typography, Slider, Grid } from '@mui/material';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from 'recharts';

const EmiCalculator = () => {
  const [loanAmount, setLoanAmount] = useState(8600000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenure, setTenure] = useState(5);

  const monthlyInterestRate = interestRate / 12 / 100;
  const numberOfMonths = tenure * 12;

  const emi = (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfMonths)) /
    (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

  const totalAmount = emi * numberOfMonths;
  const totalInterest = totalAmount - loanAmount;

  // Pie chart data
  const data = [
    { name: 'Principal', value: loanAmount },
    { name: 'Interest', value: totalInterest },
  ];

  const COLORS = ['#24c6efff', '#de32a8ff'];

  return (
    <Box sx={{ p: 4, maxWidth: 500, mx: 'auto', background: '#e6fbf9', borderRadius: '10px', mt: "25px" }}>
      <Typography variant="h5" align="center" gutterBottom>EMI Calculator</Typography>
 {/* Pie Chart Section */}
      <Box sx={{ mt: 1, height: 200 }}>  {/* reduced from 300 to 200 */}
  <Typography sx={{fontSize:12,fontWeight:'bold'}} align="center" gutterBottom>Principal vs Interest</Typography>
  <ResponsiveContainer width="100%" height="90%">
    <PieChart>
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        cx="50%"
        cy="50%"
        outerRadius={60}  
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Legend />
    </PieChart>
  </ResponsiveContainer>
</Box>

      {/* Existing sliders and boxes here */}
 <Box >
  <Typography>Loan Amount: ₹{loanAmount.toLocaleString()}</Typography>
  <Slider
    value={loanAmount}
    min={100000}
    max={10000000}
    step={10000}
    onChange={(e, val) => setLoanAmount(val)}
    sx={{
      color: '#24c6efff', // sets active track & thumb color
      '& .MuiSlider-thumb': {
        backgroundColor: '#24c6efff',
      },
      '& .MuiSlider-track': {
        backgroundColor: '#24c6efff',
      },
      '& .MuiSlider-rail': {
        backgroundColor: '#cdebf3ff', // optional: rail color light background
      },
    }}
  />
</Box>


      <Box >
        <Typography>Interest Rate: {interestRate}%</Typography>
        <Slider
          value={interestRate}
          min={1}
          max={15}
          step={0.1}
          onChange={(e, val) => setInterestRate(val)}
            sx={{
      color: '#24c6efff', // sets active track & thumb color
      '& .MuiSlider-thumb': {
        backgroundColor: '#24c6efff',
      },
      '& .MuiSlider-track': {
        backgroundColor: '#24c6efff',
      },
      '& .MuiSlider-rail': {
        backgroundColor: '#cdebf3ff', // optional: rail color light background
      },
    }}
        />
      </Box>

      <Box >
        <Typography>Loan Tenure: {tenure} years</Typography>
        <Slider
          value={tenure}
          min={1}
          max={30}
          step={1}
          onChange={(e, val) => setTenure(val)}
            sx={{
      color: '#24c6efff', // sets active track & thumb color
      '& .MuiSlider-thumb': {
        backgroundColor: '#24c6efff',
      },
      '& .MuiSlider-track': {
        backgroundColor: '#24c6efff',
      },
      '& .MuiSlider-rail': {
        backgroundColor: '#cdebf3ff', // optional: rail color light background
      },
    }}
        />
      </Box>
      {/* Your existing sliders code... */}

   <Grid container spacing={2} sx={{ justifyContent: 'space-between', mr: 4, mt: 1 }}>
  {[
    { label: "Monthly EMI:", value: `₹${emi.toFixed(0).toLocaleString()}` },
    { label: "Principal Amount:", value: `₹${loanAmount.toLocaleString()}` },
    { label: "Total Interest:", value: `₹${totalInterest.toFixed(0).toLocaleString()}` },
    { label: "Total Amount:", value: `₹${totalAmount.toFixed(0).toLocaleString()}` },
  ].map((item, index) => (
    <Grid item xs={12} sm={6} key={index}>
      <Box
        sx={{
          backgroundColor: '#24c6efff',
          borderRadius: 2,
          p: { xs: 1, sm: 2 }, // smaller padding for mobile
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          minHeight: { xs: '40px', sm: '50px' }, // smaller height for mobile
          minWidth: { xs: '103px', sm: '180px' }, // smaller width for mobile
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: { xs: '0.8rem', sm: '1rem' }, // smaller text for mobile
          }}
        >
          {item.label}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: { xs: '1rem', sm: '1.25rem' }, // smaller value text for mobile
          }}
        >
          {item.value}
        </Typography>
      </Box>
    </Grid>
  ))}
</Grid>


     

    </Box>
  );
};

export default EmiCalculator;

