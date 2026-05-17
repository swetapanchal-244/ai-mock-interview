(AI-Mock-Interview)

# InterviewAI — AI Mock Interview Platform

A full-stack web application that helps candidates practice technical interviews using voice input and real-time AI feedback.

## Features

- Voice-based answer recording using Web Speech API
- AI-powered feedback with scores for clarity, technical knowledge, and overall performance
- Role-based question generation (Software Engineer, Frontend, Backend, Full Stack)
- JWT authentication with secure login and registration
- Performance dashboard with score breakdown
- Real-time countdown timer per question
- Keywords matched analysis

## Tech Stack

**Frontend:** React.js, React Router, Axios  
**Backend:** Node.js, Express.js  
**Database:** MongoDB Atlas  
**AI:** Groq API (LLaMA 3.3 70B)  
**Auth:** JWT + bcryptjs  

## Project Structure

```
ai-mock-interview/
├── client/                  
│   └── src/
│       ├── pages/           
│       │   ├── Home.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Dashboard.jsx
│       │   └── Interview.jsx
│       └── components/      
│           ├── Navbar.jsx
│           └── ProtectedRoute.jsx
└── server/                  
    ├── controllers/         
    │   ├── authController.js
    │   └── interviewController.js
    ├── models/              
    │   └── User.js
    └── routes/              
        ├── authRoutes.js
        └── interviewRoutes.js
```

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (free)
- Groq API key (free at console.groq.com)

### Installation

1. Clone the repo

```bash
git clone https://github.com/swetapanchal-244/ai-mock-interview.git
cd ai-mock-interview
```

2. Install frontend dependencies

```bash
cd client
npm install
```

3. Install backend dependencies

```bash
cd ../server
npm install
```

4. Create `server/.env` file

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GROQ_API_KEY=your_groq_api_key
```

5. Run the app

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | User registration |
| POST | /api/auth/login | User login |
| GET | /api/interview/questions/:role | Get questions by role |
| POST | /api/interview/feedback | Get AI feedback on answer |

## How It Works

1. User registers and logs in
2. Selects a role — Software Engineer, Frontend, Backend, or Full Stack
3. AI generates 3 role-specific questions
4. User answers via typing or voice (Web Speech API)
5. Answer is sent to backend → Groq AI evaluates it
6. Scorecard shows Overall, Clarity, Technical scores + feedback + keywords matched

## Author

**Sweta Panchal**  
GitHub: [@swetapanchal-244](https://github.com/swetapanchal-244)