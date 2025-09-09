import 'dotenv/config'

// Server port
export const PORT = process.env.PORT || 5000;

// Environment
export const NODE_ENV = process.env.NODE_ENV;

// Frontend & Backend URLs
export const FRONTEND_URL = process.env.FRONTEND_URL;
export const BACKEND_URL = process.env.BACKEND_URL;

// Database Credentials
export const DB_NAME = process.env.DB_NAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_URL = process.env.DB_URL;

// OpenAI API Key
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// JWT Secret Key
export const JWT_SECRET = process.env.JWT_SECRET;

// Go High Level Configuration
export const GHL_PRIVATE_INTEGRATION_TOKEN = process.env.GHL_PRIVATE_INTEGRATION_TOKEN;
export const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;

// Lambda check
export const IS_LAMBDA = Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
