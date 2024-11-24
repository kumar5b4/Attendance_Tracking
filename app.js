const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const companyRoutes = require('./Routes/CompanyRoutes');
const employeeRoutes = require('./Routes/employeeRoutes');
const attendanceRoutes = require('./Routes/attendanceRoutes')
dotenv.config();

// Initialize Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cors());  // Allow cross-origin requests, adjust as necessary

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

    app.use(cors({
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
        allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
    }));


// Define API Routes 

app.use("/api/company", companyRoutes);
app.use("/api/company", employeeRoutes ) ;
app.use("/api/company", attendanceRoutes);     



// Home route to check if the server is running
app.get('/', (req, res) => {
    console.log("djfkldsjfldskj")
    res.send('Attendance System API is running!');
});

// Start the server
const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
