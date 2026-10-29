🏪 Mini Store - Full Stack E-Commerce Platform

A modern, feature-rich e-commerce application built with a layered architecture following Java-style enterprise patterns. This project demonstrates professional-grade backend design principles combined with a responsive React frontend.

📋 Table of Contents
Project Overview
Technology Stack
Architecture
Features
Tools & APIs
Installation & Setup
Project Structure
Database Schema
API Endpoints
Configuration
Development

🎯 Project Overview

Mini Store is a full-stack e-commerce platform that provides a complete shopping experience with user authentication, product catalog management, shopping cart, payment processing, order management, and administrative controls. The application follows enterprise-level architecture patterns with clear separation of concerns across multiple layers.

Key Highlights
✅ Layered Architecture: Controllers → Services → Repositories pattern (Java-style)
✅ JWT Authentication: Secure token-based authentication with role-based access control
✅ MongoDB Integration: NoSQL database for flexible data modeling
✅ Responsive Design: Mobile-first React frontend with dark mode support
✅ Admin Dashboard: Comprehensive admin panel for store management
✅ Payment Processing: Integration-ready payment gateway support
✅ Real-time Activity Monitoring: Track user interactions and system metrics

🛠️ Technology Stack
Backend
Technology Version Purpose
Node.js ≥18.0.0 JavaScript runtime environment
Express.js ^4.19.2 Web framework and routing
MongoDB - NoSQL database (via Mongoose)
Mongoose ^8.5.0 MongoDB ODM (Object Document Mapper)
JWT ^9.0.2 JSON Web Tokens for authentication
bcryptjs ^2.4.3 Password hashing and encryption
Multer ^1.4.5-lts.1 File upload handling
CORS ^2.8.5 Cross-Origin Resource Sharing
Morgan ^1.10.0 HTTP request logging middleware
Axios ^1.20.0 HTTP client for API calls
Dotenv ^16.4.5 Environment variable management
Frontend
Technology Version Purpose
React ^19.2.6 UI library and component framework
React Router DOM ^7.18.1 Client-side routing and navigation
Vite ^8.0.12 Fast build tool and dev server
Framer Motion ^12.42.2 Animation and motion library
Sonner ^2.0.7 Toast notification library
ESLint ^10.3.0 Code quality and linting
Prettier ^3.9.8 Code formatting
Tailwind CSS (via Autoprefixer) CSS utility framework
Development Tools
Nodemon: Auto-restart server on file changes
Vite: Lightning-fast frontend build tool
ESLint & Prettier: Code quality and formatting

🏗️ Architecture
System Architecture Diagram
┌─────────────────────────────────────────────────────────────────┐
│ CLIENT SIDE (React) │
├─────────────────────────────────────────────────────────────────┤
│ UI Layer │ Components, Pages, Layouts │
│ State Management │ Context API (Auth, Cart, Wishlist) │
│ Services Layer │ API calls via Axios │
├─────────────────────────────────────────────────────────────────┤
│ HTTP/REST Communication (JSON) │
├─────────────────────────────────────────────────────────────────┤
│ SERVER SIDE (Express.js) │
├─────────────────────────────────────────────────────────────────┤
│ Route Layer │ API Endpoints (/api/\*) │
│ Controller Layer │ Request handling & response formatting │
│ Service Layer │ Business logic & data processing │
│ Repository Layer │ Database abstraction & queries │
│ Model Layer │ Mongoose schemas & validation │
│ Middleware │ Auth, Error handling, Logging │
├─────────────────────────────────────────────────────────────────┤
│ Database Communication (MongoDB) │
├─────────────────────────────────────────────────────────────────┤
│ MONGODB DATABASE │
│ Collections: Users, Products, Orders, Carts, etc. │
└─────────────────────────────────────────────────────────────────┘
Backend Layered Architecture

1. Route Layer (/routes)
   Defines API endpoints
   Maps HTTP methods to controller methods
   Applies route-specific middleware
2. Controller Layer (/controllers)
   Receives HTTP requests
   Validates input data
   Calls service layer methods
   Formats and sends responses
   Handles error propagation

Controllers Available:

authController.js - User registration, login, logout
userController.js - User profile management
productController.js - Product CRUD operations
cartController.js - Shopping cart management
orderController.js - Order processing
paymentController.js - Payment handling
wishlistController.js - Wishlist operations
reviewController.js - Product reviews
adminController.js - Admin functionalities
supportController.js - Customer support tickets
settingsController.js - Store and user settings 3. Service Layer (/services)
Implements core business logic
Data processing and transformation
Validation logic
Integration with external APIs
Orchestrates repository calls

Services Available:

authService.js - Authentication logic
userService.js - User management
productService.js - Product operations
cartService.js - Cart logic
orderService.js - Order processing
paymentService.js - Payment processing
emailService.js - Email notifications 4. Repository Layer (/repositories)
Direct database interaction
Mongoose query abstraction
CRUD operations
Query optimization

Repositories Available:

userRepository.js
productRepository.js
cartRepository.js
orderRepository.js
paymentRepository.js
categoryRepository.js 5. Model Layer (/models)
Mongoose schema definitions
Data validation rules
Index definitions
Virtual properties 6. Middleware (/middleware)
authMiddleware.js - JWT validation
adminMiddleware.js - Admin role verification
errorMiddleware.js - Global error handling 7. Utilities (/utils)
jwt.js - JWT token generation/verification
password.js - Password hashing
response.js - Standardized response formatting
activityMonitor.js - User activity tracking
seed.js - Database seeding 8. Configuration (/config)
environment.js - Environment variables
database.js - MongoDB connection setup

Frontend Architecture
Frontend/src/
├── app/ # Application root components
│ ├── App.jsx # Main app component
│ ├── AppRoutes.jsx # Route definitions
│ ├── AppProviders.jsx # Context providers
│ └── ErrorBoundary.jsx # Error handling
├── components/ # Reusable UI components
│ ├── Navbar/ # Navigation components
│ ├── Cart.jsx # Shopping cart
│ ├── ProductCard.jsx # Product display
│ └── ...other components
├── pages/ # Page components
│ ├── Home.jsx
│ ├── Categories.jsx
│ ├── Checkout.jsx
│ ├── Auth/ # Authentication pages
│ └── Admin/ # Admin pages
├── layouts/ # Layout wrappers
│ ├── MainLayout.jsx
│ └── AdminLayout.jsx
├── context/ # React Context for state management
│ ├── AuthContext.jsx
│ ├── CartContext.jsx
│ └── WishlistContext.jsx
├── hooks/ # Custom React hooks
│ ├── useAuth.js
│ ├── useCart.js
│ └── useWishlist.js
├── services/ # API service layer
│ ├── api.js
│ ├── auth.service.js
│ ├── product.service.js
│ ├── cart.service.js
│ └── ...other services
├── theme/ # Theming support
│ └── ThemeContext.jsx
└── styles/ # Global styles
├── App.css
└── index.css

✨ Features
User Features
User Authentication
User registration and email verification
Login with JWT tokens
Password reset via email
Session management
Secure password encryption with bcryptjs
Product Browsing
Browse products by categories
Search products by name and filters
Product detail pages with reviews
Product ratings and reviews system
Wishlist functionality
Compare product features
Shopping Cart
Add/remove products from cart
Update product quantities
Cart persistence (local storage)
Real-time price calculation
Cart item count indicator
Checkout & Payment
Multi-step checkout process
Delivery location management
Order review before payment
Multiple payment options:
Card Payment (Integration ready)
UPI Payment (Integration ready)
Net Banking (Integration ready)
Order Management
View order history
Track order status
Download invoices
Cancel orders
Return items
User Profile
View and edit profile information
Manage delivery addresses
View order history
Wishlist management
Change password
Account settings
Theme Support
Light/Dark mode toggle
Persistent theme preference
Smooth theme transitions
Admin Features
Admin Dashboard
System overview and statistics
Real-time activity monitoring
Sales metrics and analytics
Product Management
Add/edit/delete products
Product image uploads
Bulk operations
Inventory management
Category management
Product status control
Order Management
View all orders
Update order status
Process refunds
Order analytics
Order filtering and search
User Management
View all registered users
User activity logs
Block/unblock users
View user details
Export user data
Payment Monitoring
Track all transactions
Payment status updates
Settlement management
Transaction history
Settings & Configuration
Store settings management
Tax configuration
Shipping settings
Email configuration
System notifications
Support Features
Customer Support
Submit support tickets
Track ticket status
Communication history
FAQ section
Contact form

🔧 Tools & APIs
Authentication & Security
JWT (JSON Web Tokens): Stateless authentication
bcryptjs: Password hashing and verification
CORS: Cross-origin resource sharing control
Role-based Access Control: Admin vs User roles
Payment Processing APIs

The system is integration-ready for:

Card Payment Gateway (Stripe, Razorpay, PayPal ready)
UPI Payment (India-specific)
Net Banking (Multiple bank support)
Payment Verification & settlement
File Management
Multer: Handle product image uploads
Static File Serving: Via Express static middleware
Image Optimization: Ready for CDN integration
Monitoring & Logging
Morgan: HTTP request logging
Activity Monitor: Custom activity tracking
Error Logging: Structured error handling
Database Tools
MongoDB Atlas: Cloud database option
Mongoose: Schema validation and modeling
Database Seeding: Sample data generation
Frontend Libraries
Axios: HTTP client for API communication
React Router: Client-side routing
Framer Motion: Smooth animations
Sonner: Toast notifications
Context API: State management

📦 Installation & Setup
Prerequisites
Node.js: v18.0.0 or higher
MongoDB: Local or MongoDB Atlas account
npm or yarn: Package manager
Git: For version control
Backend Setup

1. Navigate to backend directory
   bash
   cd backend
2. Install dependencies
   bash
   npm install
3. Create .env file
   bash

# .env file

NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173

# MongoDB Connection

MONGODB_URI=mongodb://localhost:27017/ministore

# OR for MongoDB Atlas:

# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ministore

# JWT Secret

JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRY=7d

# Email Service (optional)

EMAIL_SERVICE=gmail
EMAIL_FROM=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Upload Configuration

UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880 4. Start the server
bash

# Development mode with auto-reload

npm run dev

# Production mode

npm start 5. Seed the database (optional)
bash
npm run seed

The backend will start on http://localhost:5000 by default.

Frontend Setup

1. Navigate to frontend directory
   bash
   cd frontend
2. Install dependencies
   bash
   npm install
3. Create .env file
   bash

# .env file

VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000 4. Start the development server
bash
npm run dev

The frontend will start on http://localhost:5173 by default.

5. Build for production
   bash
   npm run build

   📁 Project Structure
   mini-store/
   ├── backend/
   │ ├── src/
   │ │ ├── config/
   │ │ │ ├── database.js # MongoDB connection setup
   │ │ │ └── environment.js # Environment configuration
   │ │ ├── middleware/
   │ │ │ ├── authMiddleware.js # JWT verification
   │ │ │ ├── adminMiddleware.js # Admin role check
   │ │ │ └── errorMiddleware.js # Global error handler
   │ │ ├── models/
   │ │ │ ├── User.js # User schema
   │ │ │ ├── Product.js # Product schema
   │ │ │ ├── Order.js # Order schema
   │ │ │ ├── Cart.js # Cart schema
   │ │ │ ├── Payment.js # Payment schema
   │ │ │ ├── Review.js # Review schema
   │ │ │ ├── Wishlist.js # Wishlist schema
   │ │ │ ├── Category.js # Category schema
   │ │ │ ├── SupportTicket.js # Support ticket schema
   │ │ │ ├── UserSettings.js # User settings
   │ │ │ └── StoreSettings.js # Store settings
   │ │ ├── controllers/
   │ │ │ ├── authController.js
   │ │ │ ├── userController.js
   │ │ │ ├── productController.js
   │ │ │ ├── cartController.js
   │ │ │ ├── orderController.js
   │ │ │ ├── paymentController.js
   │ │ │ ├── wishlistController.js
   │ │ │ ├── reviewController.js
   │ │ │ ├── adminController.js
   │ │ │ ├── supportController.js
   │ │ │ └── settingsController.js
   │ │ ├── services/
   │ │ │ ├── authService.js
   │ │ │ ├── userService.js
   │ │ │ ├── productService.js
   │ │ │ ├── cartService.js
   │ │ │ ├── orderService.js
   │ │ │ ├── paymentService.js
   │ │ │ └── emailService.js
   │ │ ├── repositories/
   │ │ │ ├── userRepository.js
   │ │ │ ├── productRepository.js
   │ │ │ ├── cartRepository.js
   │ │ │ ├── orderRepository.js
   │ │ │ ├── paymentRepository.js
   │ │ │ └── categoryRepository.js
   │ │ ├── routes/
   │ │ │ ├── authRoutes.js
   │ │ │ ├── userRoutes.js
   │ │ │ ├── productRoutes.js
   │ │ │ ├── cartRoutes.js
   │ │ │ ├── orderRoutes.js
   │ │ │ ├── paymentRoutes.js
   │ │ │ ├── wishlistRoutes.js
   │ │ │ ├── reviewRoutes.js
   │ │ │ ├── adminRoutes.js
   │ │ │ ├── supportRoutes.js
   │ │ │ ├── settingsRoutes.js
   │ │ │ └── catalogRoutes.js
   │ │ ├── utils/
   │ │ │ ├── jwt.js
   │ │ │ ├── password.js
   │ │ │ ├── response.js
   │ │ │ ├── activityMonitor.js
   │ │ │ └── seed.js
   │ │ ├── data/
   │ │ │ └── storeCategories.js # Predefined categories
   │ │ ├── app.js # Express app setup
   │ │ └── server.js # Server entry point
   │ ├── uploads/ # Product image uploads
   │ ├── package.json
   │ ├── package-lock.json
   │ └── .env # Environment variables (create)
   │
   ├── frontend/
   │ ├── src/
   │ │ ├── app/
   │ │ │ ├── App.jsx
   │ │ │ ├── AppRoutes.jsx
   │ │ │ ├── AppProviders.jsx
   │ │ │ └── ErrorBoundary.jsx
   │ │ ├── components/
   │ │ │ ├── Navbar/
   │ │ │ │ ├── Navbar.jsx
   │ │ │ │ ├── Logo.jsx
   │ │ │ │ ├── SearchBar.jsx
   │ │ │ │ ├── CategorySelector.jsx
   │ │ │ │ ├── CartButton.jsx
   │ │ │ │ ├── UserAccount.jsx
   │ │ │ │ ├── AdminLink.jsx
   │ │ │ │ ├── OrdersLink.jsx
   │ │ │ │ ├── ThemeToggle.jsx
   │ │ │ │ ├── MobileMenu.jsx
   │ │ │ │ ├── DeliveryLocation.jsx
   │ │ │ │ └── SecondaryNavbar.jsx
   │ │ │ ├── ProductCard.jsx
   │ │ │ ├── ProductList.jsx
   │ │ │ ├── Cart.jsx
   │ │ │ ├── FilterBar.jsx
   │ │ │ ├── SearchBar.jsx
   │ │ │ ├── Hero.jsx
   │ │ │ ├── Footer.jsx
   │ │ │ ├── FeatureStrip.jsx
   │ │ │ └── ProtectedRoute.jsx
   │ │ ├── pages/
   │ │ │ ├── Home.jsx
   │ │ │ ├── Categories.jsx
   │ │ │ ├── Service.jsx
   │ │ │ ├── About.jsx
   │ │ │ ├── Contact.jsx
   │ │ │ ├── Checkout.jsx
   │ │ │ ├── Orders.jsx
   │ │ │ ├── CardPayment.jsx
   │ │ │ ├── UpiPayment.jsx
   │ │ │ ├── NetBanking.jsx
   │ │ │ ├── Auth/
   │ │ │ │ ├── Login.jsx
   │ │ │ │ ├── Register.jsx
   │ │ │ │ ├── ForgotPassword.jsx
   │ │ │ │ ├── ResetPassword.jsx
   │ │ │ │ ├── Profile.jsx
   │ │ │ │ ├── Wishlist.jsx
   │ │ │ │ └── Settings.jsx
   │ │ │ └── Admin/
   │ │ │ ├── AdminDashboard.jsx
   │ │ │ ├── AdminProducts.jsx
   │ │ │ ├── AdminUsers.jsx
   │ │ │ ├── AdminMonitoring.jsx
   │ │ │ └── AdminSettings.jsx
   │ │ ├── layouts/
   │ │ │ ├── MainLayout.jsx
   │ │ │ └── AdminLayout.jsx
   │ │ ├── context/
   │ │ │ ├── AuthContext.jsx
   │ │ │ ├── CartContext.jsx
   │ │ │ └── WishlistContext.jsx
   │ │ ├── hooks/
   │ │ │ ├── useAuth.js
   │ │ │ ├── useCart.js
   │ │ │ └── useWishlist.js
   │ │ ├── services/
   │ │ │ ├── api.js
   │ │ │ ├── auth.service.js
   │ │ │ ├── product.service.js
   │ │ │ ├── cart.service.js
   │ │ │ ├── order.service.js
   │ │ │ ├── payment.service.js
   │ │ │ ├── review.service.js
   │ │ │ ├── admin.service.js
   │ │ │ ├── catalog.service.js
   │ │ │ └── wishlist.service.js
   │ │ ├── theme/
   │ │ │ └── ThemeContext.jsx
   │ │ ├── main.jsx # Vite entry point
   │ │ ├── App.css
   │ │ └── index.css
   │ ├── public/
   │ │ ├── favicon.svg
   │ │ └── icons.svg
   │ ├── dist/ # Build output
   │ ├── index.html
   │ ├── package.json
   │ ├── vite.config.js
   │ ├── eslint.config.js
   │ ├── .prettierrc.json
   │ └── .env # Environment variables (create)
   │
   ├── README.md
   └── .gitignore

   🗄️ Database Schema
   User Model
   javascript
   {
   \_id: ObjectId,
   name: String,
   email: String (unique),
   password: String (hashed),
   phone: String,
   role: String (enum: ['user', 'admin'], default: 'user'),
   isEmailVerified: Boolean,
   addresses: [{
   street: String,
   city: String,
   state: String,
   zipCode: String,
   isDefault: Boolean
   }],
   createdAt: Date,
   updatedAt: Date
   }
   Product Model
   javascript
   {
   \_id: ObjectId,
   name: String,
   description: String,
   price: Number,
   category: String,
   image: String (URL/path; existing values remain supported),
   imageMetadata: { provider, publicId, format, bytes, width, height } (optional),
   stock: Number,
   rating: Number,
   reviews: [ObjectId (Reference to Review)],
   seller: String,
   createdAt: Date,
   updatedAt: Date
   }
   Order Model
   javascript
   {
   \_id: ObjectId,
   userId: ObjectId (Reference to User),
   items: [{
   productId: ObjectId,
   quantity: Number,
   price: Number
   }],
   status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
   totalAmount: Number,
   shippingAddress: {
   street: String,
   city: String,
   state: String,
   zipCode: String
   },
   paymentStatus: String (enum: ['pending', 'completed', 'failed']),
   paymentId: ObjectId (Reference to Payment),
   estimatedDelivery: Date,
   createdAt: Date,
   updatedAt: Date
   }
   Cart Model
   javascript
   {
   \_id: ObjectId,
   userId: ObjectId (Reference to User),
   items: [{
   productId: ObjectId,
   quantity: Number,
   price: Number
   }],
   totalPrice: Number,
   createdAt: Date,
   updatedAt: Date
   }
   Payment Model
   javascript
   {
   \_id: ObjectId,
   orderId: ObjectId (Reference to Order),
   userId: ObjectId (Reference to User),
   amount: Number,
   paymentMethod: String (enum: ['card', 'upi', 'netbanking']),
   transactionId: String,
   status: String (enum: ['pending', 'completed', 'failed']),
   createdAt: Date,
   updatedAt: Date
   }
   Review Model
   javascript
   {
   \_id: ObjectId,
   productId: ObjectId (Reference to Product),
   userId: ObjectId (Reference to User),
   rating: Number (1-5),
   comment: String,
   createdAt: Date,
   updatedAt: Date
   }
   Wishlist Model
   javascript
   {
   \_id: ObjectId,
   userId: ObjectId (Reference to User),
   products: [ObjectId (References to Products)],
   createdAt: Date,
   updatedAt: Date
   }
   Category Model
   javascript
   {
   \_id: ObjectId,
   name: String,
   description: String,
   slug: String,
   createdAt: Date
   }
   SupportTicket Model
   javascript
   {
   \_id: ObjectId,
   userId: ObjectId (Reference to User),
   subject: String,
   description: String,
   status: String (enum: ['open', 'in-progress', 'resolved', 'closed']),
   priority: String (enum: ['low', 'medium', 'high']),
   messages: [{
   senderId: ObjectId,
   message: String,
   createdAt: Date
   }],
   createdAt: Date,
   updatedAt: Date
   }

   🔌 API Endpoints
   Authentication Routes (/api/auth)
   Method Endpoint Description Auth Required
   POST /register Register new user No
   POST /login User login No
   POST /logout User logout Yes
   POST /forgot-password Forgot password No
   POST /reset-password/:token Reset password No
   POST /refresh-token Refresh JWT token Yes
   User Routes (/api/users)
   Method Endpoint Description Auth Required
   GET /profile Get user profile Yes
   PUT /profile Update user profile Yes
   GET /:id Get user by ID Yes (Admin)
   PUT /password Change password Yes
   POST /addresses Add delivery address Yes
   GET /addresses Get user addresses Yes
   DELETE /addresses/:addressId Delete address Yes
   Product Routes (/api/products)
   Method Endpoint Description Auth Required
   GET / Get all products No
   GET /:id Get product details No
   POST / Create product Yes (Admin)
   PUT /:id Update product Yes (Admin)
   DELETE /:id Delete product Yes (Admin)
   POST /:id/upload-image Upload product image Yes (Admin)
   GET /search?q=term Search products No
   Cart Routes (/api/cart)
   Method Endpoint Description Auth Required
   GET / Get cart Yes
   POST /add Add item to cart Yes
   PUT /update/:productId Update cart item quantity Yes
   DELETE /:productId Remove from cart Yes
   DELETE /clear Clear entire cart Yes
   Order Routes (/api/orders)
   Method Endpoint Description Auth Required
   GET / Get user orders Yes
   GET /:id Get order details Yes
   POST / Create new order Yes
   PUT /:id/status Update order status Yes (Admin)
   DELETE /:id Cancel order Yes
   GET /:id/invoice Download invoice Yes
   Payment Routes (/api/payments)
   Method Endpoint Description Auth Required
   POST /process Process payment Yes
   GET /:id Get payment details Yes
   PUT /:id/verify Verify payment Yes
   POST /refund Process refund Yes (Admin)
   Wishlist Routes (/api/wishlist)
   Method Endpoint Description Auth Required
   GET / Get wishlist Yes
   POST /add/:productId Add to wishlist Yes
   DELETE /:productId Remove from wishlist Yes
   Review Routes (/api/reviews)
   Method Endpoint Description Auth Required
   GET /product/:productId Get product reviews No
   POST / Add product review Yes
   PUT /:id Update review Yes
   DELETE /:id Delete review Yes
   Admin Routes (/api/admin)
   Method Endpoint Description Auth Required
   GET /dashboard Get dashboard data Yes (Admin)
   GET /users Get all users Yes (Admin)
   GET /orders Get all orders Yes (Admin)
   GET /products Get all products Yes (Admin)
   GET /analytics Get analytics data Yes (Admin)
   POST /settings Update store settings Yes (Admin)
   Support Routes (/api/support)
   Method Endpoint Description Auth Required
   GET /tickets Get user tickets Yes
   POST /tickets Create support ticket Yes
   GET /tickets/:id Get ticket details Yes
   POST /tickets/:id/reply Reply to ticket Yes
   Settings Routes (/api/settings)
   Method Endpoint Description Auth Required
   GET /store Get store settings No
   PUT /store Update store settings Yes (Admin)
   GET /user Get user settings Yes
   PUT /user Update user settings Yes
   Catalog Routes (/api/catalog)
   Method Endpoint Description Auth Required
   GET /categories Get all categories No
   GET /categories/:id Get category details No
   POST /categories Create category Yes (Admin)
   PUT /categories/:id Update category Yes (Admin)
   DELETE /categories/:id Delete category Yes (Admin)
   Health Check
   Method Endpoint Description
   GET /api/health API health status

   ⚙️ Configuration
   Environment Variables
   Backend (.env file)

# Server Configuration

NODE_ENV=development # Environment (development/production)
PORT=5000 # Server port
CLIENT_URL=http://localhost:5173 # Frontend URL for CORS

# Database Configuration

MONGODB_URI=mongodb://localhost:27017/ministore

# JWT Configuration

JWT_SECRET=your_secret_key_here # Secret key for JWT signing
JWT_EXPIRY=7d # Token expiration time

# Email Configuration (Optional)

EMAIL_SERVICE=gmail
EMAIL_FROM=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# File Upload Configuration

UPLOAD_PATH=./uploads # Directory for storing uploads
MAX_FILE_SIZE=5242880 # Maximum file size (5MB)

# Payment Gateway Keys (when integrated)

STRIPE*SECRET_KEY=sk_test*...
RAZORPAY*KEY_ID=rzp_test*...
Frontend (.env file)

# API Configuration

VITE_API_URL=http://localhost:5000/api
VITE_API_TIMEOUT=30000 # Request timeout in ms
Database Connection

Local MongoDB:

javascript
MONGODB_URI=mongodb://localhost:27017/ministore

MongoDB Atlas (Cloud):

javascript
MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/ministore?retryWrites=true&w=majority

💻 Development
Starting Development Environment
Option 1: Run in separate terminals

Terminal 1 - Backend:

bash
cd backend
npm run dev

Terminal 2 - Frontend:

bash
cd frontend
npm run dev
Option 2: Run concurrently (requires concurrently package)
bash
npm run dev:all
Code Quality
Formatting Code
bash

# Backend

cd backend && npm run format

# Frontend

cd frontend && npm run format
Linting
bash

# Frontend

cd frontend && npm run lint
Building for Production

Backend:

bash
cd backend
npm install
npm start

Frontend:

bash
cd frontend
npm install
npm run build
Database Seeding

To populate the database with sample data:

bash
cd backend
npm run seed

🚀 Deployment

This project is designed to run as two services:

- **Frontend** → [Vercel](https://vercel.com) (Vite/React)
- **Backend** → [Render](https://render.com) (Express/Node)
- **Database** → MongoDB Atlas (or any MongoDB URI)

### 1. Backend on Render

1. Push this repo to GitHub.
2. On Render → **New → Blueprint** (uses root `render.yaml`) **or** **New Web Service**.
3. If creating a Web Service manually:
   - **Root Directory:** `backend`
   - **Build Command:** `npm ci`
   - **Start Command:** `npm start`
4. Set these environment variables:

   ```
   NODE_ENV=production
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=a_long_random_secret
   CLIENT_URL=https://your-frontend.vercel.app
   API_PUBLIC_URL=https://your-backend.onrender.com
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

   Configure the Cloudinary credentials in Render's environment settings for
   persistent product image uploads. Never commit these credentials. Optional:
   `RESEND_API_KEY`, PhonePe sandbox keys (see `backend/.env.example`).

   Do **not** hardcode `PORT` — Render injects it automatically.

5. After deploy, confirm `https://your-backend.onrender.com/api/health` returns success.

### 2. Frontend on Vercel

1. On Vercel → **Add New Project** → import this repo.
2. Leave **Root Directory** as the repository root (uses root `vercel.json`), **or** set Root Directory to `frontend` (uses `frontend/vercel.json`).
3. Add environment variable (Production + Preview):

   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

4. Deploy. Then update Render `CLIENT_URL` to your Vercel URL if it changed.

### 3. Wire them together

| Variable | Where | Value |
| --- | --- | --- |
| `VITE_API_URL` | Vercel | `https://<render-service>.onrender.com/api` |
| `CLIENT_URL` | Render | `https://<vercel-app>.vercel.app` (comma-separate extra origins if needed) |
| `API_PUBLIC_URL` | Render | `https://<render-service>.onrender.com` |
| `MONGO_URI` | Render | Atlas connection string |
| `JWT_SECRET` | Render | Strong random string |
| `CLOUDINARY_CLOUD_NAME` | Render | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Render | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Render | Cloudinary API secret |

Local development: copy `backend/.env.example` → `backend/.env` and `frontend/.env.example` → `frontend/.env`.

🔐 Security Features
Password Security
Bcryptjs hashing with salt rounds
No plain text passwords stored
Authentication
JWT token-based authentication
Secure token generation and validation
Token expiration and refresh mechanism
Authorization
Role-based access control (RBAC)
Route protection middleware
Admin-only endpoints verification
Data Validation
Input validation at controller level
Mongoose schema validation
CORS protection
Error Handling
No sensitive information in error messages
Structured error responses
Unhandled rejection handling

📈 Performance Optimization
Database Indexing
Indexed fields for faster queries
Optimized Mongoose schemas
Caching Ready
Structure supports Redis integration
JWT-based stateless authentication
File Upload Optimization
Multer configuration for efficient uploads
File size limiting
Frontend Optimization
Vite for fast builds
React lazy loading support
Component-based architecture

🐛 Troubleshooting
MongoDB Connection Issues
bash

# Check if MongoDB is running

sudo systemctl status mongod

# Or for MongoDB Atlas, verify connection string

Port Already in Use
bash

# Change port in .env file or

# Kill process using port 5000

lsof -ti:5000 | xargs kill -9
CORS Errors
Ensure CLIENT_URL in backend .env matches frontend URL
Check browser console for specific CORS errors
JWT Token Issues
Verify JWT_SECRET is set in .env
Clear browser local storage and login again
Check token expiration time

📝 License

This project is licensed under the MIT License.

👥 Support

For issues, questions, or suggestions:

Check existing documentation
Review code comments for specific implementations
Test API endpoints with Postman or cURL
Enable debug logging for troubleshooting

🎓 Learning Resources
Express.js: https://expressjs.com/
MongoDB/Mongoose: https://mongoosejs.com/
React: https://react.dev/
Vite: https://vitejs.dev/
JWT: https://jwt.io/

🚀 Future Enhancements
Real-time notifications using WebSocket
Advanced search with Elasticsearch
Machine learning product recommendations
Multi-language support (i18n)
Advanced analytics dashboard
Mobile app (React Native)
Inventory management automation
Email notification system integration
SMS notifications
Two-factor authentication (2FA)

Last Updated: September 2026
Version: 1.0.0
Status: Production Ready ✅
