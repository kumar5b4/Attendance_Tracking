const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const express = require("express");
const cors = require("cors");

const app = express(); // Define the express app

// Enable CORS
app.use(cors());

// Swagger definition with bearerAuth security scheme
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authentication API",
      version: "1.0.0",
      description: "API for authenticating via JWT",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    // Apply security globally
    security: [
      {
        bearerAuth: [], 
      },
    ],
    servers: [
      {
        url: "http://localhost:3000/api/company", // Your server URL
        description: "Development server",
      },
    ],
  },
  apis: ["./routes/*.js"], // Path to your API routes
};

const swaggerSpec = swaggerJsdoc(options);

// Export swagger setup if needed for other files
module.exports = {
  swaggerUi,
  swaggerSpec,
};
