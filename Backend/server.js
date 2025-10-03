const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

const userRoutes = require('./routes/UserRoutes');
const financeCompanyRoutes = require('./routes/FinanceCompanyRoutes');
const loanRoutes = require('./routes/LoanApplicationRoutes');
const feedbackRoutes = require('./routes/FeedbackRoutes');
const productsRoute = require('./routes/Products');
const AdminEmiRoute = require('./routes/AdminEmiRoute');
const adminNotificationRoutes = require('./routes/AdminNotification');
const userProfileRoute = require('./routes/UserProfile');
const msgRoutes = require('./routes/msgRoutes');
const loanEntryRoutes = require('./routes/LoanEntryRoutes');


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());



// Serve uploads folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error(`Error connecting to MongoDB: ${err.message}`);
  process.exit(1);
});

// Use routes
app.use('/api', userRoutes);
app.use('/api/financeCompanies', financeCompanyRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/products', productsRoute);
app.use('/api/admin', AdminEmiRoute);
app.use('/api', userProfileRoute);
app.use('/api/ManagerAuth', require('./routes/ManagerAuth'));
app.use('/api/admin/Notification', adminNotificationRoutes);
app.use('/api/emis', msgRoutes); // matches frontend URL
app.use('/api/sms', require('./routes/sms'));
app.use('/api/loan-entries', loanEntryRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
{/*// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');



const userRoutes = require('./routes/UserRoutes');
const financeCompanyRoutes = require('./routes/FinanceCompanyRoutes');
const loanRoutes = require('./routes/LoanApplicationRoutes');
const feedbackRoutes = require('./routes/FeedbackRoutes');

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.error(`Error connecting to MongoDB: ${err.message}`);
  process.exit(1);
});

// Use user routes
app.use('/api', userRoutes);
app.use('/api/financeCompanies', financeCompanyRoutes);
app.use('/api/loan', loanRoutes);
app.use('/api/feedback', feedbackRoutes);


// Root route test
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));*/}
{/*const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/financio', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api', userRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));*/}
