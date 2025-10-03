
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const bcrypt = require("bcrypt"); // This line is fine if you're using it later

// Load environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Define the port from environment variables or default to 5000
const PORT = process.env.PORT || 5000;


const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the MONGO_URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    // Log any errors that occur during connection
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit the process with a failure code if connection fails
    process.exit(1);
  }
};


const startServer = async () => {
  // First, attempt to connect to the database
  await connectDB();

  // If the database connection is successful, then start the Express server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

// Call the function to start the server and connect to the database
startServer();



// Example Root Route
app.get('/', (req, res) => {
  res.send('API is running...');
});

