
require("dotenv").config();

// Database connection string for MongoDB (local instance)
const DB_URI = process.env.DB_URI;

// Base API URL for making backend requests (used in the frontend or other services)
const API = process.env.API;

// Cloudinary settings for handling image uploads
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Client URL for frontend applications
const CLIENT_URL = process.env.CLIENT_URL;

// Google API key for various services
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// NextAuth secret for encrypting JWT tokens
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

// Google OAuth credentials for authentication
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// Razorpay API keys for handling payments
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// PayPal API keys for handling payments
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

const APP_ID = process.env.APP_ID;
const KEY = process.env.KEY;
const SECRET = process.env.SECRET;
const CLUSTER = process.env.CLUSTER;

// Exporting all configurations as a module
module.exports = {
  DB_URI,
  API,
  NEXTAUTH_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  GOOGLE_API_KEY,
  CLIENT_URL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_SECRET,
  RAZORPAY_KEY_SECRET,
  RAZORPAY_KEY_ID,

  APP_ID,
  KEY,
  SECRET,
  CLUSTER,
};