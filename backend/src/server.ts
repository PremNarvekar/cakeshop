import path from 'path';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import connectDB from './config/db';
import { notFound, errorHandler } from './middlewares/errorMiddleware';

dotenv.config();

connectDB();

const app = express();

// Security Middlewares
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" })); // For images

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});
app.use(limiter);

// Enable CORS
app.use(cors({
  origin: ['https://cakeshop-jjxh.onrender.com', 'https://cakeeshopp.netlify.app', 'http://localhost:3000'],
  credentials: true
}));

// Request Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for frontend
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

// Uploads static viewing
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));


import adminRoutes from './routes/admin.routes';
import cakeRoutes from './routes/cake.routes';

// APIs will be mounted here
app.use('/api/admin', adminRoutes);
app.use('/api/cakes', cakeRoutes);

// Catch-all for frontend routes (SPA) - Must be after API routes
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});
// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
