# Complete Setup & Deployment Guide

## 📋 Checklist Before Submission

- [ ] All 4 collections created with proper validation
- [ ] CRUD endpoints working for all collections  
- [ ] Unit tests written and passing
- [ ] JWT authentication configured
- [ ] Swagger docs at `/api-docs`
- [ ] MongoDB Atlas connected
- [ ] Deployed to Render with custom domain
- [ ] Demo video recorded (5-8 minutes)
- [ ] GitHub repo with all code
- [ ] README.md complete with instructions
- [ ] Individual contributions documented

## 🎥 Recording Your Demo Video

### Video Requirements
- **Length**: 5-8 minutes (NOT longer)
- **Format**: MP4 or WebM
- **Quality**: 720p minimum
- **Audio**: Clear and audible
- **Participants**: Each team member should be visible on camera

### What to Demonstrate

#### 1. API Overview (1 min)
- Show Swagger documentation at `/api-docs`
- Explain the 4 collections
- Show project structure

#### 2. Authentication (1 min)
- Show user registration and login using JWT
- Display returned JWT token and authenticated request flow
- Show logout by clearing the token client-side

#### 3. CRUD Operations (3-4 mins)

**Create Operations:**
```
POST /api/users → Show user created
POST /api/products → Show product created
POST /api/orders → Show order created
POST /api/reviews → Show review created
```

**Read Operations:**
```
GET /api/users → Show all users
GET /api/products → Show all products  
GET /api/orders → Show all orders
GET /api/reviews → Show all reviews
```

**Update Operations:**
```
PUT /api/users/:id → Update user details
PUT /api/products/:id → Update product info
PUT /api/orders/:id → Update order status
```

**Delete Operations:**
```
DELETE /api/users/:id → Delete user
DELETE /api/products/:id → Delete product
DELETE /api/orders/:id → Delete order
```

#### 4. Error Handling (1 min)
- Try invalid email format
- Try duplicate email
- Try invalid product ID
- Show proper error messages

#### 5. Deployment (1 min)
- Show Render deployment
- Show live API docs at `/api-docs`
- Show health check endpoint working

### Recording Tips

**Using OBS Studio (Free):**
```
1. Download OBS Studio
2. Create Scene with screen capture
3. Add microphone audio
4. Set recording resolution to 1280x720
5. Start recording
6. Demonstrate all features
7. Stop recording and save
```

**Using ScreenFlow (Mac):**
```
1. Open ScreenFlow
2. Select screen area
3. Include audio from microphone
4. Record demo
5. Export as MP4
```

**Using Windows Screen Recorder:**
```
1. Press Windows + G
2. Click "Record" 
3. Demonstrate features
4. Stop recording
5. Video saved to Videos folder
```

## 🚀 Quick Start Commands

```bash
# 1. Install dependencies
npm install

# 2. Update .env with your credentials
# Edit .env file with MongoDB URI and JWT credentials

# 3. Run locally
npm run dev

# 4. Test API
npm test

# 5. Access Swagger
# Open http://localhost:5000/api-docs in browser
```

## 🔗 Important URLs

### Local Development
- **API Base**: `http://localhost:5000`
- **Swagger Docs**: `http://localhost:5000/api-docs`
- **Health Check**: `http://localhost:5000/health`

### Production (After Render Deployment)
- **API Base**: `https://your-app-name.onrender.com`
- **Swagger Docs**: `https://your-app-name.onrender.com/api-docs`
- **Health Check**: `https://your-app-name.onrender.com/health`

## 📦 Postman Collection (Optional)

You can import this into Postman for testing:

```json
{
  "info": {
    "name": "E-Commerce API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Users",
      "item": [
        {
          "name": "Get All Users",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/users"
          }
        },
        {
          "name": "Create User",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/users",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john@example.com\",\n  \"phone\": \"+1-123-456-7890\",\n  \"address\": \"123 Main St\"\n}"
            }
          }
        }
      ]
    },
    {
      "name": "Products",
      "item": [
        {
          "name": "Get All Products",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/api/products"
          }
        },
        {
          "name": "Create Product",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/api/products",
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Laptop\",\n  \"description\": \"High-performance laptop\",\n  \"category\": \"Electronics\",\n  \"price\": 999.99,\n  \"stock\": 50\n}"
            }
          }
        }
      ]
    }
  ]
}
```

## ✅ Rubric Alignment

Your submission must cover:

| Requirement | How to Show |
|-------------|------------|
| 4+ Collections | Show in MongoDB/Swagger (Users, Products, Orders, Reviews) |
| 7+ Fields in 1 Collection | Show User schema with all fields |
| MongoDB Connection | Show connected database in logs |
| CRUD for All Collections | Demonstrate all 5 operations in video |
| Error Handling | Show validation errors in demo |
| GET Routes Tests | Run `npm test` and show passing tests |
| JWT Authentication | Show login/register flow with JWT |
| Swagger Documentation | Show `/api-docs` with all endpoints |
| Render Deployment | Show live API working on Render |
| Individual Contributions | Document in README |

## 📝 Submission Checklist

Before submitting to Canvas, ensure you have:

1. **GitHub Repository**
   - [ ] All code committed
   - [ ] README.md complete
   - [ ] .env.example file (with placeholder values)
   - [ ] Clean commit history

2. **Render Deployment**
   - [ ] App deployed and running
   - [ ] `/api-docs` accessible
   - [ ] Environment variables configured
   - [ ] Health check working

3. **YouTube Video**
   - [ ] 5-8 minutes long
   - [ ] Camera on (show your face)
   - [ ] Clear audio
   - [ ] All team members visible (if group project)
   - [ ] Demonstrates all requirements
   - [ ] Unlisted or public visibility

4. **Canvas Submission**
   - [ ] GitHub repo link
   - [ ] Render deployment link
   - [ ] YouTube video link
   - [ ] Individual contribution description (2+ contributions)

## 🆘 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED

Solution:
1. Check MONGO_URI in .env
2. Verify MongoDB Atlas is running
3. Check firewall/network settings
4. Ensure IP whitelist in Atlas
```

### JWT Authentication Issues
```
Error: Invalid or missing JWT

Solution:
1. Check `JWT_SECRET` is set in `.env`
2. Verify login credentials and request body
3. Ensure protected routes include `Authorization: Bearer <token>` header
```

### Tests Failing
```
Error: Cannot connect to MongoDB

Solution:
1. Update MONGO_URI in .env to test database
2. Ensure MongoDB is running
3. Clear node_modules and reinstall: rm -rf node_modules && npm install
```

### Render Deployment Failed
```
Error: Build failed

Solution:
1. Check build logs in Render dashboard
2. Verify all dependencies in package.json
3. Ensure npm install works locally first
4. Check that server.js exists
```

## 🎓 Learning Outcomes

By completing this project, you'll have learned:

✓ Full-stack API development  
✓ Database design with MongoDB  
✓ JWT authentication flow  
✓ RESTful API principles  
✓ API documentation with Swagger  
✓ Unit testing with Jest  
✓ Production deployment  
✓ Error handling patterns  
✓ Input validation  
✓ Team collaboration with Git  

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [jsonwebtoken Docs](https://www.npmjs.com/package/jsonwebtoken)
- [Swagger UI Docs](https://swagger.io/tools/swagger-ui/)
- [Jest Docs](https://jestjs.io/)
- [Render Docs](https://render.com/docs)

---

Good luck with your project! Remember: **Each team member should be present in the video recording.**
