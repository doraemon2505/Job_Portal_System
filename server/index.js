const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
dotenv.config();

// Connect to the database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// Routes
const authRoutes = require('./route/authRoutes');
const contactRoutes = require('./route/contactRoutes');
const jobRoutes = require('./route/jobRoutes');
const applicationRoutes = require('./route/applicationRoute');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/application', applicationRoutes);


app.get('/', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});