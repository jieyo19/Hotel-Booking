import express from "express"
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

connectDB();
connectCloudinary();

const app = express();

// FIXED: CORS configuration with proper options
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Add your frontend URLs
  credentials: true
}));

app.use(express.json());

// Enhanced debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// Clerk middleware for authentication
app.use(clerkMiddleware());

// API to listen to Clerk Webhooks (before other routes and auth)
app.use("/api/clerk", clerkWebhooks);

// API Routes - These are now properly registered
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

// Root route - This should be LAST
app.get("/", (req, res) => res.send("API is working"));

// ADDED: 404 handler for unmatched routes
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.path}`
  });
});

// ADDED: Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);