import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import swaggerSpec from './swagger/swagger.js';
import errorHandler from './middleware/errorHandler.js';

// Routes
import userRoutes from './routes/userRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import dealershipRoutes from './routes/dealershipRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
await connectDB();

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Vehicle Marketplace API',
    version: '1.0.0',
    endpoints: {
      docs: '/api-docs',
      users: '/api/users',
      vehicles: '/api/vehicles',
      dealerships: '/api/dealerships',
      reviews: '/api/reviews',
    },
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/dealerships', dealershipRoutes);
app.use('/api/reviews', reviewRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});

export default app;

export default app;

