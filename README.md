# ExpressBazaar
ExpressBazaar — Where Backend Meets Basket.
# ExpressBazaar

## Introduction
ExpressBazaar is a full-stack e-commerce platform enabling separate interfaces for sellers and buyers. Sellers can manage their products through a dedicated dashboard while buyers can browse and purchase products.

## Project Type
Fullstack

## Deployed App
- Frontend: [ExpressBazaar Client](https://friendly-capybara-9dd838.netlify.app/)
- Backend: [ExpressBazaar API](https://expressbazaar.onrender.com)
- Database: MongoDB Atlas

## Directory Structure
```
ExpressBazaar/
├─ Back-end/
│  ├─ configs/
│  │  ├─ cloudinary.config.js
│  │  └─ mongodb.config.js
│  ├─ buyers/
│  │  ├─ controllers/
│  │  │  ├─ buyer.auth.js
│  │  │  └─ searchProduct.controller.js
│  │  ├─ middlewares/
│  │  │  └─ auth.middleware.js
│  │  └─ routes/
│  │     └─ buyer.auth.route.js
│  ├─ sellers/
│  │  ├─ controllers/
│  │  │  ├─ product.controller.js
│  │  │  └─ seller.auth.js
│  │  ├─ middlewares/
│  │  │  ├─ auth.middleware.js
│  │  │  └─ multer.middleware.js
│  │  ├─ models/
│  │  │  └─ product.model.js
│  │  └─ routers/
│  │     └─ product.router.js
│  ├─ app.js
│  └─ package.json
├─ Front-end/
│  ├─ SellerDashBoard/
│  │  ├─ Dashboard/
│  │  │  ├─ dashboard.css
│  │  │  ├─ dashboard.html
│  │  │  └─ script.js
│  │  └─ sellerproductPage/
│  │     ├─ sellerProduct.html
│  │     └─ script.js
│  ├─ signupLogin/
│  │  ├─ signupOrlogin.html
│  │  ├─ styles.css
│  │  └─ script.js
│  ├─ userInterface/
│  │  ├─ index.html
│  │  └─ script.js
│  └─ baseurl.js
└─ README.md
```

## API Endpoints

### Buyer Routes (`/`)
```
Authentication:
POST /signup - Buyer registration
POST /login - Buyer login

Products:
GET /allProducts - Get all products
GET /allProducts/:id - Get specific product
POST /addToCart/:id - Add product to cart (Auth required)
PATCH /removeFromCart/:id - Remove product from cart (Auth required)
```

### Seller Routes (`/seller`)
```
Authentication:
POST /seller/signup - Seller registration
POST /seller/login - Seller login

Product Management (Auth required):
POST /seller/create - Create new product (multipart/form-data, supports 5 images)
GET /seller/products - Get seller's products
GET /seller/products/:id - Get specific product
PATCH /seller/update/:id - Update product
DELETE /seller/delete/:id - Delete product
```

## Features
- **Authentication**
  - Separate signup/login for buyers and sellers
  - JWT-based authentication
  - Role-based access control

- **Seller Features**
  - Product management dashboard
  - Multiple image upload support
  - Product CRUD operations
  - Sales analytics

- **Buyer Features**
  - Product browsing
  - Shopping cart functionality
  - Product search and filtering
  - Order management

## Tech Stack
### Frontend
- Vanilla JavaScript
- HTML5/CSS3
- Font Awesome icons
- LocalStorage for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- Cloudinary for image storage

## Installation & Getting Started

1. **Clone the repository**
```bash
git clone <repository-url>
cd ExpressBazaar
```

2. **Backend Setup**
```bash
cd Back-end
npm install

# Create .env file with:
PORT=8080
MONGODB_URI=your_mongodb_uri
jwt=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Start server
npm start
```

3. **Frontend Setup**
```bash
cd Front-end
# Open with live server or set up your preferred server
```

## Environment Variables
```env
PORT=8080
MONGODB_URI=mongodb+srv://...
jwt=your_secret_key
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

