# MINDMATE AI Backend

Complete Node.js/Express backend server for MINDMATE AI Student Wellness Assistant.

## Quick Start

```bash
npm install
cp .env.example .env
npm start
```

Server runs on http://localhost:5000

## Directory Structure

- `server.js` - Express server with Socket.io
- `config/` - Database and JWT configuration
- `models/` - MongoDB Mongoose schemas
- `routes/` - API route handlers
- `middleware/` - Authentication and error handling
- `services/` - Business logic and AI integration
- `utils/` - Helper functions and utilities

## Features

✅ JWT Authentication
✅ WebSocket Real-time Chat
✅ Mood Tracking & Analytics
✅ AI-Powered Chatbot
✅ Personalized Recommendations
✅ Task Management
✅ Admin Dashboard

## API Endpoints

### Authentication
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`

### User
- `GET /api/user/profile`
- `PUT /api/user/profile`
- `GET /api/user/wellness-score`

### Chat
- `POST /api/chat/send`
- `GET /api/chat/history`
- `DELETE /api/chat/:messageId`

### Mood
- `POST /api/mood/log`
- `GET /api/mood/trends`

### Recommendations
- `GET /api/recommendations`
- `POST /api/recommendations/:id/feedback`

### Tasks
- `POST /api/tasks`
- `GET /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

### Analytics
- `GET /api/analytics/dashboard`
- `GET /api/analytics/report`

## Environment Variables

See `.env.example` for all required variables.

## Technologies

- Express.js
- MongoDB + Mongoose
- JWT Authentication
- Socket.io
- OpenAI/Gemini APIs

## License

MIT