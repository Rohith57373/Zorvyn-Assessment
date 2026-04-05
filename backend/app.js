const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const app = express();

// Security / Rate Limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000, // Developer relaxed limit
    message: { message: "Too many requests from this IP, please try again later." }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use('/api/', apiLimiter);

// Swagger Docs Setup
try {
    const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'swagger.yaml'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (e) {
    console.error("Swagger API documentation failed to load:", e.message);
}

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Basic Route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Finance Dashboard API' });
});

// 404 Route Not Found
app.use((req, res, next) => {
    res.status(404).json({ message: "Route Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ 
        message: err.message || "Internal Server Error" 
    });
});

module.exports = app;
