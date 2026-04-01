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
