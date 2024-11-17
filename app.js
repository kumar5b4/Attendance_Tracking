const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import routes
const locationRoutes = require('./Routes/locationRoutes');
const roleRoutes = require('./Routes/roleRoutes');
const employeeRoutes = require('./Routes/employeeRoutes');
const loginRoutes = require('./Routes/loginRoutes')

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
app.use('/api/attendance', locationRoutes);  // Location-based login/logout
app.use('/api/roles', roleRoutes);         // Role management for HR/Employee
app.use('/api/users', employeeRoutes );         // User creation and management (HR, Employee)
app.use('/api/login',loginRoutes)



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
