# Shravan - Voice-Enabled Medicine Reminder App

A production-ready MERN stack web application designed specifically for elderly users to manage their medication schedules with voice interaction capabilities.

## Features

### Core Functionality

- **User Authentication**: Secure signup/login with JWT tokens
- **Medicine Management**: Add, edit, and delete medicines with dosage and timing
- **Smart Reminders**: Automated notifications at scheduled times
- **Voice Interaction**: Add medicines and receive feedback using Web Speech API
- **Dashboard**: Overview of today's medicines and quick actions
- **History Tracking**: Monitor medication adherence over time

### Elderly-Friendly Design

- Large, readable fonts and buttons
- High contrast colors for better visibility
- Simple, intuitive interface
- Voice commands for hands-free operation
- Minimal cognitive load

## Tech Stack

### Frontend

- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Web Speech API** for voice features

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcrypt** for password hashing
- **node-cron** for scheduled reminders

## Project Structure

```
shravan/
├── backend/                 # Node.js/Express backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Authentication middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json
├── src/                    # React frontend
│   ├── api/                # API service functions
│   ├── components/         # Reusable React components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Frontend dependencies
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite configuration
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/shravan
   JWT_SECRET=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

4. Start MongoDB service (if running locally)

5. Start the backend server:
   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the root directory:

   ```bash
   cd shravan
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173` (or next available port)

### Production Build

1. Build the frontend:

   ```bash
   npm run build
   ```

2. The built files will be in the `dist/` directory

## Usage

### First Time Setup

1. Open the application in your browser
2. Create an account or sign in
3. Add your first medicine using the voice command or manual form

### Voice Commands

- "Add [medicine name] [dosage] at [time]"
- "Remind me to take [medicine name]"
- Examples:
  - "Add aspirin 100mg at 2:00 pm"
  - "Remind me to take vitamin D 2000 IU at 8:00 am"

### Managing Medicines

- View all medicines on the "Manage Medicines" page
- Edit or delete medicines as needed
- Mark medicines as taken when you receive reminders

### Notifications

- Enable browser notifications when prompted
- Reminders will appear as browser notifications
- Voice feedback is provided for voice interactions

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Medicines

- `GET /api/medicines` - Get all medicines
- `POST /api/medicines` - Add new medicine
- `PUT /api/medicines/:id` - Update medicine
- `DELETE /api/medicines/:id` - Delete medicine
- `PATCH /api/medicines/:id/taken` - Mark as taken
- `GET /api/medicines/history` - Get dose history

## Browser Support

### Voice Features

- Chrome/Chromium-based browsers (recommended)
- Edge
- Safari (limited support)
- Firefox (limited support)

### General Compatibility

- Modern browsers with ES6+ support
- Mobile responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
