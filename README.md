# Vehicle Marketplace API

Production-ready REST API for managing vehicle marketplace with users, vehicles, dealerships, and reviews. Built with Node.js, Express.js, MongoDB, Mongoose, and comprehensive Swagger documentation.

## 🎯 Project Overview

This is a complete backend solution for a vehicle marketplace platform with:

- **Node.js & Express.js** - Server framework
- **MongoDB & Mongoose** - Database and ODM
- **Swagger/OpenAPI** - Interactive API documentation
- **Jest & Supertest** - Unit testing framework
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Error Handling** - Centralized middleware

## 📋 Features

### ✅ Core Features
- ✓ 4 Collections (Users, Vehicles, Dealerships, Reviews)
- ✓ Full CRUD operations for all collections
- ✓ Input validation and sanitization
- ✓ Comprehensive error handling
- ✓ Professional Swagger documentation
- ✓ Unit tests for all GET routes
- ✓ Environment variable support
- ✓ Timestamps on all documents
- ✓ Population of references (dealership, user, vehicle)
- ✓ Production deployment ready

## 🔐 Collections & Fields

### Users
- `firstName` (string, required, min 2 chars)
- `lastName` (string, required, min 2 chars)
- `email` (string, unique, required, valid email format)
- `password` (string, required, min 6 chars)
- `role` (enum: buyer, seller, admin, default: buyer)
- `createdAt` & `updatedAt` (timestamps)

### Vehicles
- `make` (string, required)
- `model` (string, required)
- `year` (number, required, 1900 to current year + 1)
- `price` (number, required, minimum 0)
- `mileage` (number, required, minimum 0)
- `dealerId` (ObjectId reference to Dealership, required)
- `createdAt` & `updatedAt` (timestamps)

### Dealerships
- `name` (string, required)
- `location` (string, required)
- `phone` (string, required, valid format)
- `email` (string, required, valid email format)
- `createdAt` & `updatedAt` (timestamps)

### Reviews
- `userId` (ObjectId reference to User, required)
- `vehicleId` (ObjectId reference to Vehicle, required)
- `rating` (number, required, 1-5)
- `comment` (string, optional, max 1000 chars)
- `createdAt` & `updatedAt` (timestamps)

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Step 1: Clone and Install

```bash
# Navigate to project folder
cd c:\Users\Admin\Downloads\CSE341\ PROJECT

# Install dependencies
npm install
```

### Step 2: Create `.env` File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB: mongodb://localhost:27017/vehicle-marketplace
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/vehicle-marketplace?retryWrites=true&w=majority
MONGO_URI=mongodb://localhost:27017/vehicle-marketplace
```

### Step 3: MongoDB Setup

#### Option A: Local MongoDB

```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Create a database user
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/vehicle-marketplace?retryWrites=true&w=majority`
6. Add to `.env` as `MONGO_URI`

## 🏃 Running the Project

### Development Mode

```bash
npm run dev
```

Server starts at `http://localhost:8000` with auto-reload on file changes.

### Production Mode

```bash
npm start
```

### API Documentation

Visit: **http://localhost:8000/api-docs**

Interactive Swagger UI for testing all endpoints.

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Test Files

Tests are organized by resource:
- `tests/users.test.js` - User GET routes
- `tests/vehicles.test.js` - Vehicle GET routes
- `tests/dealerships.test.js` - Dealership GET routes
- `tests/reviews.test.js` - Review GET routes

All tests verify:
- HTTP status codes
- Response structure
- Data integrity
- Error handling
- 404 responses
- Input validation

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Users
```
GET    /api/users              # Get all users
GET    /api/users/:id          # Get user by ID
POST   /api/users              # Create user
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
```

### Vehicles
```
GET    /api/vehicles           # Get all vehicles (populated with dealership)
GET    /api/vehicles/:id       # Get vehicle by ID
POST   /api/vehicles           # Create vehicle
PUT    /api/vehicles/:id       # Update vehicle
DELETE /api/vehicles/:id       # Delete vehicle
```

### Dealerships
```
GET    /api/dealerships        # Get all dealerships
GET    /api/dealerships/:id    # Get dealership by ID
POST   /api/dealerships        # Create dealership
PUT    /api/dealerships/:id    # Update dealership
DELETE /api/dealerships/:id    # Delete dealership
```

### Reviews
```
GET    /api/reviews            # Get all reviews (populated with user and vehicle)
GET    /api/reviews/:id        # Get review by ID
POST   /api/reviews            # Create review
PUT    /api/reviews/:id        # Update review
DELETE /api/reviews/:id        # Delete review
```

## 📝 Request Examples

### Create a User
```bash
POST /api/users
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "buyer"
}
```

### Create a Dealership
```bash
POST /api/dealerships
Content-Type: application/json

{
  "name": "Downtown Motors",
  "location": "123 Main St, New York, NY",
  "phone": "555-0123",
  "email": "contact@downtown.com"
}
```

### Create a Vehicle
```bash
POST /api/vehicles
Content-Type: application/json

{
  "make": "Toyota",
  "model": "Camry",
  "year": 2022,
  "price": 25999.99,
  "mileage": 15000,
  "dealerId": "507f1f77bcf86cd799439013"
}
```

### Create a Review
```bash
POST /api/reviews
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "vehicleId": "507f1f77bcf86cd799439012",
  "rating": 5,
  "comment": "Excellent vehicle! Great condition."
}
```

## 🏗️ Project Structure

```
/
├── config/
│   └── db.js                 # MongoDB connection
├── controllers/
│   ├── userController.js
│   ├── vehicleController.js
│   ├── dealershipController.js
│   └── reviewController.js
├── middleware/
│   ├── validation.js         # Express validator rules
│   └── errorHandler.js       # Global error handling
├── models/
│   ├── User.js
│   ├── Vehicle.js
│   ├── Dealership.js
│   └── Review.js
├── routes/
│   ├── userRoutes.js
│   ├── vehicleRoutes.js
│   ├── dealershipRoutes.js
│   └── reviewRoutes.js
├── swagger/
│   └── swagger.js            # Swagger/OpenAPI config
├── tests/
│   ├── users.test.js
│   ├── vehicles.test.js
│   ├── dealerships.test.js
│   └── reviews.test.js
├── server.js                 # Express app entry point
├── .env.example              # Environment variables template
├── package.json
└── README.md
```

## 🔐 HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 404 | Not Found |
| 409 | Conflict (duplicate email) |
| 500 | Internal Server Error |

## ✅ Response Format

### Success Response
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Create account at [Render](https://render.com)
3. Create new Web Service from repository
4. Set environment variables in Render dashboard
5. Deploy

### Environment Variables for Production

```env
PORT=8000
NODE_ENV=production
MONGO_URI=<Your MongoDB Atlas connection string>
```

## 📚 Dependencies

### Core
- express@^4.18.2
- mongoose@^7.6.0
- dotenv@^16.3.1
- cors@^2.8.5

### Validation & Documentation
- express-validator@^7.0.0
- swagger-jsdoc@^6.2.8
- swagger-ui-express@^5.0.0

### Testing
- jest@^29.7.0
- supertest@^6.3.3

### Development
- nodemon@^3.0.1

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Mongoose](https://mongoosejs.com/)
- [Swagger OpenAPI](https://swagger.io/)
- [Jest Testing](https://jestjs.io/)

## 🤝 Contributing

1. Create a new branch for features
2. Follow existing code style
3. Add tests for new functionality
4. Submit pull request

## 📄 License

ISC

## 👨‍💻 Author

CSE341 Student

---

**Last Updated:** June 2026

For issues or questions, please refer to the API documentation at `/api-docs`

### Products
```
GET    /api/products           # Get all products
GET    /api/products/:id       # Get product by ID
POST   /api/products           # Create product
PUT    /api/products/:id       # Update product
DELETE /api/products/:id       # Delete product
```

### Orders
```
GET    /api/orders             # Get all orders
GET    /api/orders/:id         # Get order by ID
POST   /api/orders             # Create order
PUT    /api/orders/:id         # Update order
DELETE /api/orders/:id         # Delete order
```

### Reviews
```
GET    /api/reviews            # Get all reviews
GET    /api/reviews/:id        # Get review by ID
GET    /api/reviews/product/:productId  # Get reviews for product
POST   /api/reviews            # Create review
PUT    /api/reviews/:id        # Update review
DELETE /api/reviews/:id        # Delete review
```

### Authentication
```
GET    /api/auth/google        # Initiate Google login
GET    /api/auth/google/callback # Google callback
GET    /api/auth/user          # Get current user
POST   /api/auth/logout        # Logout
```

## 📝 API Examples

### 1. Create a User

**POST** `/api/users`

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1-123-456-7890",
  "address": "123 Main St, City, State",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1-123-456-7890",
    "address": "123 Main St, City, State",
    "role": "customer",
    "createdAt": "2024-05-28T10:30:00Z",
    "updatedAt": "2024-05-28T10:30:00Z"
  }
}
```

### 2. Create a Product

**POST** `/api/products`

```json
{
  "name": "Wireless Laptop",
  "description": "High-performance laptop with 16GB RAM",
  "category": "Electronics",
  "price": 999.99,
  "stock": 50,
  "image": "https://example.com/laptop.jpg"
}
```

### 3. Create an Order

**POST** `/api/orders`

```json
{
  "userId": "507f1f77bcf86cd799439011",
  "products": [
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 2,
      "price": 999.99
    }
  ],
  "totalAmount": 1999.98,
  "paymentMethod": "credit_card",
  "shippingAddress": "456 Oak Ave, City, State"
}
```

### 4. Create a Review

**POST** `/api/reviews`

```json
{
  "productId": "507f1f77bcf86cd799439012",
  "userId": "507f1f77bcf86cd799439011",
  "rating": 5,
  "comment": "Excellent product! Highly recommended."
}
```

### 5. Get All Users

**GET** `/api/users`

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      ...
    }
  ]
}
```

## 🔒 Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error message describing what went wrong"
}
```

### Common HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate email, etc.)
- `500` - Internal Server Error

## 🛡️ Validation

All POST and PUT routes include validation:

### User Validation
- First/Last name: required, max 50 chars
- Email: required, unique, valid format
- Phone: required, valid format
- Address: required, max 200 chars

### Product Validation
- Name: required, max 100 chars
- Description: required, max 1000 chars
- Category: required, valid enum
- Price: required, must be positive
- Stock: required, non-negative integer

### Order Validation
- userId: required, valid MongoDB ID
- Products: required, non-empty array
- Quantity: each product must have quantity ≥ 1
- TotalAmount: required, positive number
- PaymentMethod: required, valid enum
- ShippingAddress: required

### Review Validation
- productId: required, valid MongoDB ID
- userId: required, valid MongoDB ID
- Rating: required, 1-5 only
- Comment: optional, max 500 chars

## 🌐 Deployment to Render

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/repo-name.git
git push -u origin main
```

### Step 2: Connect to Render

1. Go to [Render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" and select "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: ecommerce-marketplace-api
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### Step 3: Add Environment Variables

In Render dashboard, go to Environment:

```
MONGO_URI=your_mongodb_atlas_uri
NODE_ENV=production
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=https://your-app.onrender.com/api/auth/google/callback
SESSION_SECRET=your_session_secret
RENDER_EXTERNAL_URL=https://your-app.onrender.com
```

### Step 4: Deploy

1. Click "Deploy"
2. Wait for deployment to complete
3. Access your API at: `https://your-app-name.onrender.com`
4. Access Swagger docs at: `https://your-app-name.onrender.com/api-docs`

## 📹 Demo Video Requirements

Your demo video should showcase:

1. **Authentication**
   - Show Google OAuth login flow
   - Display user session management
   - Show logout functionality

2. **GET Routes**
   - Retrieve all users
   - Retrieve all products
   - Retrieve all orders
   - Retrieve all reviews
   - Show filtering/searching (if implemented)

3. **POST Routes**
   - Create a new user
   - Create a new product
   - Create a new order
   - Create a new review

4. **PUT Routes**
   - Update a user record
   - Update a product
   - Update an order status

5. **DELETE Routes**
   - Delete a user
   - Delete a product
   - Delete an order
   - Delete a review

6. **Swagger Documentation**
   - Show API docs at `/api-docs`
   - Test routes using Swagger UI
   - Display schema documentation

7. **Error Handling**
   - Show validation errors
   - Show 404 errors for invalid IDs
   - Show 409 error for duplicate email

## 📊 Project Structure

```
.
├── config/
│   ├── database.js          # MongoDB connection
│   └── passport.js          # OAuth configuration
├── controllers/
│   ├── userController.js    # User CRUD logic
│   ├── dealershipController.js  # Product CRUD logic
│   ├── vehicleController.js # Order CRUD logic
│   └── reviewController.js  # Review CRUD logic
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── errorHandler.js      # Global error handler
│   ├── validation.js        # Input validation
│   └── logger.js            # Request logging
├── models/
│   ├── User.js              # User schema
│   ├── Dealership.js        # Product schema
│   ├── Vehicle.js           # Order schema
│   └── Review.js            # Review schema
├── routes/
│   ├── userRoutes.js        # User routes
│   ├── dealershipRoutes.js  # Product routes
│   ├── vehicleRoutes.js     # Order routes
│   ├── reviewRoutes.js      # Review routes
│   └── authRoutes.js        # Auth routes
├── swagger/
│   └── swagger.js           # Swagger setup
├── tests/
│   ├── setup.js             # Test setup
│   ├── users.test.js        # User tests
│   ├── products.test.js     # Product tests
│   ├── orders.test.js       # Order tests
│   └── reviews.test.js      # Review tests
├── .env                     # Environment variables
├── server.js                # Entry point
├── package.json             # Dependencies
├── jest.config.json         # Jest configuration
├── render.yaml              # Render deployment config
└── README.md                # This file
```

## 🔧 Technologies

| Technology | Purpose |
|-----------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **Passport.js** | Authentication |
| **Swagger** | API documentation |
| **Jest** | Testing framework |
| **Express Validator** | Input validation |
| **dotenv** | Environment variables |
| **CORS** | Cross-origin requests |
| **Express Session** | Session management |

## ⚙️ Middleware Stack

1. **Logging** - Requests/responses logged with timestamps
2. **CORS** - Cross-origin resource sharing enabled
3. **Body Parser** - JSON and URL-encoded body parsing
4. **Session** - Express session for OAuth
5. **Passport** - OAuth authentication
6. **Validation** - Express validator for inputs
7. **Error Handler** - Global error handling

## 🔐 Security Features

- Input validation and sanitization
- MongoDB injection prevention
- CORS protection
- Session security
- Password hashing ready (bcrypt imported)
- Environment variables for sensitive data
- Error messages don't expose sensitive details
- Async error handling throughout

## 💡 Individual Contributions

Each team member should document their contributions in this section:

### Team Member 1: [Your Name]
- Set up project structure and dependencies
- Created MongoDB models with validation
- Implemented all CRUD controllers with error handling
- Wrote unit tests for GET routes

### Team Member 2: [Your Name]
- Set up OAuth authentication with Google/Passport
- Created comprehensive Swagger documentation
- Implemented validation middleware
- Configured Render deployment

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For issues or questions, please create an issue in the GitHub repository.

---

**Built for BYU-Pathway CSE341 Final Project** ✨
