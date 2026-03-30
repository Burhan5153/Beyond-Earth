# 🚀 Beyond Earth - Space Exploration & Planet Trip Booking Website

A full-stack web application for booking space trips to Mars and exploring the universe. This project demonstrates a complete booking system with subscriptions, land purchases, and premium content access.

## 🌟 Features

### Core Features
- **Mars Trip Booking**: Book main tickets for trips to Mars with spaceship travel, landing, galaxy viewing, and guided tours
- **Additional Activities**: Add-on activities including:
  - Mars walking tours
  - Mars Rover rides
  - Galaxy space photography sessions
  - Mars souvenir collection
  - Land purchasing on Mars
  - Moon walking experiences (simulated)

### Premium Features
- **Subscription System**: Monthly, Yearly, and Premium subscription plans
- **Premium Content Access**: Exclusive space content including:
  - High-quality galaxy videos
  - Rare planet images
  - Advanced space facts
  - Special space documentaries

### Land Ownership
- **Mars Land Purchasing**: Buy residential, commercial, or luxury land on Mars
- **Ownership Certificates**: Receive official certificates with registration details
- **Land Location Tracking**: Get coordinates and map locations of purchased land

### User Dashboard
- **Astronaut Dashboard**: View all bookings and manage your space journey
- **Live Countdown**: See countdown to next Mars flight
- **Spaceship Tracking**: Real-time location tracking (simulated)
- **Booking Management**: View booking status, payment status, and activities

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

### Frontend
- **React** 19.2
- **React Router** for navigation
- **Axios** for API calls
- **CSS3** with animations and gradients

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### 🐳 Docker Deployment (Recommended)

For easy deployment and consistent environments, use Docker:

1. **Install Docker**: https://www.docker.com/get-started

2. **Create `.env` file** in the root directory:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/beyond-earth
JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_test_key
FRONTEND_URL=http://localhost:3000
REACT_APP_API_URL=http://localhost:5000/api
```

3. **Build and start**:
```bash
docker-compose up --build
```

4. **Seed database** (optional):
```bash
docker-compose run --rm backend node seed.js
```

5. **Access**:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

📖 **For detailed Docker instructions**, see [DOCKER_SETUP.md](./DOCKER_SETUP.md)

---

### Manual Installation (Without Docker)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your MongoDB connection string and JWT secret:
```env
MONGODB_URI=mongodb://localhost:27017/beyond-earth
JWT_SECRET=your-super-secret-jwt-key
PORT=5000
```

5. Seed the database with activities:
```bash
node seed.js
```

6. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost:5000):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🗄️ Database Models

### User
- Authentication information
- Subscription details (plan, dates, status)

### Booking
- Main trip ticket information
- Additional activities
- Flight dates and pricing
- Payment and status tracking
- Spaceship location data

### LandPurchase
- Land type (residential, commercial, luxury)
- Size and pricing
- Ownership certificate details
- Coordinates and map location

### Activity
- Activity types and descriptions
- Pricing and duration
- Availability status

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Bookings
- `POST /api/bookings` - Create new booking (protected)
- `GET /api/bookings/my-bookings` - Get user's bookings (protected)
- `GET /api/bookings/:id` - Get single booking (protected)
- `PUT /api/bookings/:id` - Update booking (protected)
- `GET /api/bookings/next-flight/countdown` - Get countdown to next flight

### Activities
- `GET /api/activities` - Get all available activities
- `GET /api/activities/:type` - Get activity by type

### Subscriptions
- `POST /api/subscriptions` - Subscribe to a plan (protected)
- `GET /api/subscriptions/status` - Get subscription status (protected)
- `DELETE /api/subscriptions` - Cancel subscription (protected)

### Land Purchases
- `POST /api/land` - Purchase land (protected)
- `GET /api/land/my-land` - Get user's land purchases (protected)
- `GET /api/land/:id` - Get single land purchase (protected)

### Content
- `GET /api/content/premium` - Get premium content (protected, requires subscription)
- `GET /api/content/public` - Get public content

## 🎨 Features Highlights

### Beautiful UI/UX
- Animated starfield background
- Gradient color schemes
- Smooth transitions and hover effects
- Responsive design for all devices
- Glassmorphism card designs

### User Experience
- Intuitive navigation
- Real-time form validation
- Loading states and error handling
- Success notifications
- Protected routes for authenticated users

### Business Logic
- Flexible booking system with base ticket + add-ons
- Subscription-based premium content access
- Land ownership with certificates
- Payment status tracking
- Booking status management

## 📝 Project Structure

```
Beyond-Earth/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── server.js        # Express server
│   ├── seed.js          # Database seeder
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/      # Page components
│   │   ├── context/    # React context
│   │   ├── services/   # API service
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🎯 Future Enhancements

- Real payment gateway integration (Stripe, PayPal)
- Live spaceship tracking with real-time updates
- 3D space visualization
- Video streaming for premium content
- Email notifications for bookings
- Admin dashboard for managing bookings
- Support for additional planets (Venus, Jupiter, etc.)
- Real-time chat support
- Booking calendar with availability

## 📄 License

This project is created for educational purposes as a class project.

## 👨‍🚀 Author

Created as a class project for BS Software Engineering - 5th Semester

---

**Note**: This project uses copyrighted material (images, information) for educational/demonstration purposes only and will not be used commercially.

