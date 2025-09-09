import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
// import { FRONTEND_URL } from './config/index.js';
import { apiError } from './utils/apiError.js';
import { apiResponse } from './utils/apiResponse.js';
import leadRoutes from './route/lead.routes.js';


// Initialize express app
const app = express();

// Security middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: [
        "http://localhost:5173",
        "http://affinitisolutions.com",
        "https://affinitisolutions.com",
        "https://www.affinitisolutions.com",
        "https://deeptrustai.affinitisolutions.com",
        "https://mydeeptrust.com",
        "https://www.mydeeptrust.com",
        "https://mydeeptrust.ai",
        "https://www.mydeeptrust.ai",
      ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
// app.use(limiter);

// Request parsing middleware
app.use(morgan('dev')); // Logging
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());



// Health check
app.get('/health', (req, res) => {
   return apiResponse(res, 200, 'Health check successful', null, true);
});


// Routes
app.use('/api/v1/lead', leadRoutes);

// Global 404 Handler for unmatched routes
app.use((req, res, next) => {
    return apiError(res, 404, 'Route not found', null, false);
});

// Centralized error handler middleware
app.use((err, req, res, next) => {
    // Check if headers have already been sent
    if (res.headersSent) {
        return next(err);
    }
    console.error(err.stack);
    return apiError(res, 500, 'Something went wrong', err.message, false);
});

export default app;