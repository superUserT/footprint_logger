# Footprint Logger 🌱

A full-stack carbon footprint tracking application that helps users monitor and reduce their environmental impact through activity logging and community comparison.

## Features

### 🔐 Authentication System

- User registration and login with JWT tokens
- Secure password hashing with bcryptjs
- Protected routes with token verification

### 📊 Personal Dashboard

- **Activity Tracking**: Log daily activities with CO₂ savings calculations
- **Real-time Statistics**:
  - Total CO₂ saved
  - Number of activities logged
  - Average CO₂ per activity
- **Weekly Goals**: Set and track weekly emission reduction targets
- **Activity History**: View recent environmental activities

### 🌍 Community Features

- **Global Leaderboard**: Rank users by total CO₂ savings
- **Community Comparison**: Compare personal savings against community average
- **Total Impact**: View collective CO₂ savings across all users

### 📱 User Experience

- Responsive Material-UI design
- Real-time data updates
- Intuitive navigation
- Progress visualization

## Tech Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Pino** - Structured logging

### Frontend

- **React** - UI framework
- **Material-UI** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation
- **Vite** - Build tool

## Project Structure

```
footprint-logger/
├── backend/
│   ├── models/
│   │   └── database.js          # MongoDB schemas and models
│   ├── routes/
│   │   ├── authRoutes.js        # Authentication endpoints
│   │   └── footprintLoggerRoutes.js # Activity logging endpoints
│   ├── config/
│   │   └── mongoDbConfig.js     # Database connection
│   ├── utils/
│   │   ├── helper_objects.js    # Message templates
│   │   └── helper_functions.js  # Validation functions
│   └── footprint_loggger.js     # Logging configuration
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/       # User dashboard
│   │   │   ├── LoginPage/       # Authentication
│   │   │   ├── Leaderboard/     # Community ranking
│   │   │   └── SubmitPage/      # Activity logging
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication state
│   │   └── App.jsx              # Main application
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login

### Activity Management

- `GET /api/logs` - Get user's activity logs
- `POST /api/logs` - Create new activity log
- `PUT /api/logs/:id` - Update activity log
- `DELETE /api/logs/:id` - Delete activity log

### Statistics

- `GET /api/logs/user/stats` - Get user statistics
- `GET /api/logs/leaderboard` - Get community leaderboard
- `GET /api/logs/stats/total-co2` - Get total community impact

## Database Schema

### User Model

```javascript
{
  username: String,     // Unique username
  email: String,        // Unique email
  password: String,     // Hashed password
  isActive: Boolean,    // Account status
  createdAt: Date,      // Account creation date
  updatedAt: Date       // Last update date
}
```

### Log Model

```javascript
{
  userId: ObjectId,     // Reference to user
  logId: Number,        // Sequential log ID
  date: Date,           // Activity date
  activity: String,     // Activity description
  co2Saved: Number,     // CO₂ savings in kg
  createdAt: Date,      // Log creation date
  updatedAt: Date       // Last update date
}
```

## Key Features Implementation

### 🔐 Secure Authentication

- Passwords hashed with bcryptjs (salt rounds: 10)
- JWT tokens with expiration for session management
- Protected routes with authentication middleware

### 📈 Advanced Analytics

- MongoDB aggregations for statistics
- Real-time leaderboard calculations
- Community average computations

### 🎯 Weekly Goals & Streaks

- Goal tracking system
- Activity streak detection
- Progress visualization

### 🌐 Community Engagement

- Global leaderboard ranking
- Comparative analytics
- Collective impact measurement

## Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/superUserT/footprint_logger.git
   cd footprint-logger
   ```

2. **Install backend dependencies**

   ```bash
   cd footprint_logger-backend
   npm install
   ```

3. **Install frontend dependencies**

   ```bash
   cd ../footprint_logger-frontend
   npm install
   ```

4. **Environment Setup**

   - Create `.env` files in both backend and frontend
   - Configure MongoDB connection string
   - Set JWT secret key
   - Configure API base URL

5. **Start the application**

   ```bash
   # Start backend (from backend directory)
   npm run start

   # Start frontend (from frontend directory)
   npm run start
   ```

## Usage

1. **Register** a new account or **login** with existing credentials
2. **Submit activities** through the submission form
3. **View dashboard** for personal statistics and progress
4. **Check leaderboard** to see community rankings
5. **Track weekly goals** and maintain activity streaks

## Environmental Impact

This application helps users:

- 📉 Reduce carbon footprint through conscious tracking
- 📊 Visualize environmental impact over time
- 👥 Participate in community sustainability efforts
- 🎯 Set and achieve personal environmental goals

## Future Enhancements

- [ ] Advanced analytics and reporting
- [ ] Carbon offset integration
- [ ] Educational content and tips
- [ ] Gamification elements

## Contributing

This is a learning project demonstrating full-stack development with React, Node.js, and MongoDB. Feel free to explore the code and adapt it for educational purposes.

## License

Educational project - feel free to use for learning purposes.

---

**Built with ❤️ for a greener planet** 🌍
Thabiso Rantsho
