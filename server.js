import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import connectDB from './config/db.js';
import swaggerSpec from './swagger/swagger.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import dealershipRoutes from './routes/dealershipRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import errorHandler, { notFoundHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/health', (req, res) => {
  res.status(200).json({ success: true, status: 'ok' });
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { swaggerOptions: { persistAuthorization: true } })
);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Vehicle Marketplace API',
    version: '1.0.0',
    endpoints: {
      docs: '/api-docs',
      auth: '/api/auth',
      users: '/api/users',
      vehicles: '/api/vehicles',
      dealerships: '/api/dealerships',
      reviews: '/api/reviews',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/dealerships', dealershipRoutes);
app.use('/api/reviews', reviewRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  if (process.env.NODE_ENV === 'test') {
    return;
  }

  await connectDB();

  const server = app.listen(PORT, () => {
    const actualPort = server.address().port;
    console.log(`Server running on port ${actualPort}`);
    console.log(`API Documentation: http://localhost:${actualPort}/api-docs`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${PORT} is in use, attempting to use an available port...`);
      const fallbackServer = app.listen(0, () => {
        const fallbackPort = fallbackServer.address().port;
        console.log(`Server started on fallback port ${fallbackPort}`);
        console.log(`API Documentation: http://localhost:${fallbackPort}/api-docs`);
      });

      fallbackServer.on('error', (fallbackError) => {
        console.error('Fallback server failed to start:', fallbackError.message);
        process.exit(1);
      });
      return;
    }

    console.error('Server failed to start:', error.message);
    process.exit(1);
  });
};

await startServer();

export default app;

