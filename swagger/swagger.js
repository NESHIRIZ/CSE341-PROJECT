import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Vehicle Marketplace API',
      version: '1.0.0',
      description: 'A comprehensive REST API for managing a vehicle marketplace with users, vehicles, dealerships, and reviews.',
      contact: {
        name: 'API Support',
        email: 'support@vehiclemarketplace.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            firstName: {
              type: 'string',
              example: 'John',
            },
            lastName: {
              type: 'string',
              example: 'Doe',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              example: 'hashedPassword',
            },
            role: {
              type: 'string',
              enum: ['buyer', 'seller', 'admin'],
              example: 'buyer',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Vehicle: {
          type: 'object',
          required: ['make', 'model', 'year', 'price', 'mileage', 'dealerId'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439012',
            },
            make: {
              type: 'string',
              example: 'Toyota',
            },
            model: {
              type: 'string',
              example: 'Camry',
            },
            year: {
              type: 'number',
              example: 2022,
            },
            price: {
              type: 'number',
              example: 25000,
            },
            mileage: {
              type: 'number',
              example: 15000,
            },
            dealerId: {
              type: 'string',
              example: '507f1f77bcf86cd799439013',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Dealership: {
          type: 'object',
          required: ['name', 'location', 'phone', 'email'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439013',
            },
            name: {
              type: 'string',
              example: 'Premium Auto Dealership',
            },
            location: {
              type: 'string',
              example: '123 Main Street, Springfield',
            },
            phone: {
              type: 'string',
              example: '555-1234',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'contact@dealer.com',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Review: {
          type: 'object',
          required: ['userId', 'vehicleId', 'rating'],
          properties: {
            _id: {
              type: 'string',
              example: '507f1f77bcf86cd799439014',
            },
            userId: {
              type: 'string',
              example: '507f1f77bcf86cd799439011',
            },
            vehicleId: {
              type: 'string',
              example: '507f1f77bcf86cd799439012',
            },
            rating: {
              type: 'number',
              minimum: 1,
              maximum: 5,
              example: 5,
            },
            comment: {
              type: 'string',
              example: 'Great vehicle! Highly recommended.',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;

