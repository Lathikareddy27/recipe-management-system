# RecipeHub - Recipe Management System

A full-stack Recipe Management System built with React, Node.js, Express, and MongoDB. Features user authentication, recipe CRUD operations, search/filter, favorites, user profiles, and an admin panel.

## Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client (for backend integration)
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - Image upload handling

## Project Structure

```
recipe-management-system/
├── client/                  # Frontend (React)
│   ├── public/
│   ├── src/
│   │   ├── api/            # API client & mock API
│   │   ├── components/     # Reusable components
│   │   ├── context/        # Auth context
│   │   ├── pages/          # Page components
│   │   ├── types/          # TypeScript types
│   │   ├── App.tsx         # Main app with routes
│   │   └── main.tsx        # Entry point
│   ├── package.json
│   └── tailwind.config.js
├── server/                  # Backend (Node.js + Express)
│   ├── config/             # DB connection
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, error, upload middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── utils/               # Seed script
│   ├── .env.example
│   ├── package.json
│   └── server.js           # Entry point
└── README.md
```

## Features

### Authentication
- User registration with name, email, password
- User login with JWT token
- Logout
- Protected routes (requires authentication)
- Admin-only routes

### Dashboard
- Welcome message with user name
- Total recipes count
- Favorite recipes count
- Recent recipes preview
- My recipes quick view

### Recipe Management
- Add new recipe with all fields
- View all recipes with pagination
- View recipe details
- Edit recipe (owner only)
- Delete recipe (owner or admin)
- Search recipes by name
- Filter by category
- Favorite/unfavorite recipes

### Recipe Fields
- Recipe Name
- Category (Breakfast, Lunch, Dinner, Snacks, Desserts, Drinks, Vegetarian, Non-Vegetarian)
- Ingredients (list)
- Instructions
- Preparation Time
- Cooking Time
- Difficulty (Easy, Medium, Hard)
- Servings
- Image Upload
- Created Date

### User Profile
- View profile information
- Edit profile (name, bio, avatar)
- Change password

### Admin Panel
- Admin dashboard with system stats
- Manage all users (view, delete)
- Manage all recipes (view, delete)
- Delete users (also deletes their recipes)

## REST API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Login user |
| POST | `/api/users/logout` | Logout user |
| GET | `/api/users/profile` | Get user profile (protected) |
| PUT | `/api/users/profile` | Update profile (protected) |
| PUT | `/api/users/password` | Change password (protected) |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Get all recipes (with pagination, search, filter) |
| GET | `/api/recipes/:id` | Get recipe by ID |
| POST | `/api/recipes` | Create recipe (protected) |
| PUT | `/api/recipes/:id` | Update recipe (protected, owner) |
| DELETE | `/api/recipes/:id` | Delete recipe (protected, owner/admin) |
| PUT | `/api/recipes/:id/favorite` | Toggle favorite (protected) |
| GET | `/api/recipes/my` | Get current user's recipes (protected) |
| GET | `/api/recipes/favorites` | Get user's favorite recipes (protected) |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Admin dashboard stats (admin) |
| GET | `/api/admin/users` | Get all users (admin) |
| DELETE | `/api/admin/users/:id` | Delete user (admin) |
| GET | `/api/admin/recipes` | Get all recipes (admin) |
| DELETE | `/api/admin/recipes/:id` | Delete recipe (admin) |

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Server Setup

```bash
cd server
npm install
```

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB connection string and JWT secret:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/recipe_management
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:3000
```

Seed the database with sample data (optional):
```bash
npm run seed
```

Start the server:
```bash
npm start
```
Or with nodemon for development:
```bash
npm run dev
```

The server runs on `http://localhost:5000`.

### Client Setup

```bash
cd client
npm install
```

Create a `.env` file:
```
VITE_API_URL=http://localhost:5000/api
```

Start the client:
```bash
npm start
```

The client runs on `http://localhost:3000`.

## Demo Accounts

After seeding the database, you can use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@recipe.com | password123 |
| User | demo@recipe.com | password123 |

## In-Browser Demo (Without MongoDB)

The client includes a built-in mock API that simulates the backend using browser localStorage. This allows you to run and test the full application without setting up MongoDB or the backend server.

The mock API provides all the same functionality as the real backend, including:
- User registration and login
- Recipe CRUD operations
- Favorites
- Admin panel
- Search and filtering

To use the real backend instead, set `VITE_API_URL` in the client `.env` file and update the API imports to use the axios client.

## Categories

- Breakfast
- Lunch
- Dinner
- Snacks
- Desserts
- Drinks
- Vegetarian
- Non-Vegetarian

## License

This project is created for educational purposes as part of a Web Development internship.
