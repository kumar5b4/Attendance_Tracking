const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const companyRoutes = require('./Routes/CompanyRoutes');
const employeeRoutes = require('./Routes/employeeRoutes');
const attendanceRoutes = require('./Routes/attendanceRoutes');
const forgotPassword = require('./Routes/forgotPassword');
const branchRoutes = require('./Routes/branchRoutes');
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

// CORS configuration
app.use(cors({
    origin: 'http://localhost:3000', // Adjust to your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

// API Routes
app.use("company", companyRoutes);
app.use("", employeeRoutes);
app.use("", attendanceRoutes);
app.use("", forgotPassword);
app.use("", branchRoutes);

// Swagger Setup
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Attendance Tracking',
            version: '1.0.0',
            description: 'API documentation for my Node.js application',
        },
        basePath: '/',
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: 'JWT Authorization header',
            },
        },
    },
    apis: ['./Routes/*.js'],  // Path to your API route files
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Home route to check if the server is running
app.get('/', (req, res) => {
    console.log("Server is running");
    res.send('Attendance System API is running!');
});

// Start the server
const PORT = process.env.PORT || 5000;  // Default to 5000 if PORT is not defined
app.listen(PORT, () => {
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    console.log(`Server is running on port ${PORT}`);
});
