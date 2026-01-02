Voter-AI-Platform
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

A web-based prototype to assist voters using AI-inspired chat, image relevance checks, and voter information validation.

************************************************************************************************************************
TECH STACK
************************************************************************************************************************

Frontend

Next.js
React
Tailwind CSS

Backend

Node.js
Express
SQLite
JWT Authentication
bcrypt (password hashing)
Custom Middleware (authentication and route protection)

************************************************************************************************************************
PREREQUISITES
************************************************************************************************************************

Node.js (v18+ recommended)
npm

************************************************************************************************************************
SETUP & RUN LOCALLY
************************************************************************************************************************

Clone the repository
git clone https://github.com/your-username/voter-ai-platform.git
cd voter-ai-platform

************************************************************************************************************************
BACKEND SETUP
************************************************************************************************************************

Navigate to backend directory
cd backend

Install dependencies
npm install

Create environment file
cp .env.example .env

Initialize SQLite database (required once)
node database/init.js

Start backend server
npm run dev

Backend runs on: http://localhost:5000

************************************************************************************************************************
FRONTEND SETUP
************************************************************************************************************************

Navigate to frontend directory
cd frontend

Install dependencies
npm install

Tailwind CSS
Tailwind CSS is already configured in the project.
No additional installation is required after npm install.

Start frontend
npm run dev

Frontend runs on: http://localhost:3000

************************************************************************************************************************
DEPENDENCIES USED
************************************************************************************************************************

Backend dependencies

express
sqlite3
bcrypt
jsonwebtoken
cors
dotenv

Installed via

npm install express sqlite3 bcrypt jsonwebtoken cors dotenv


Frontend dependencies

tailwindcss
postcss
autoprefixer

Installed via

npm install tailwindcss postcss autoprefixer

************************************************************************************************************************
NOTES
************************************************************************************************************************

The current implementation uses rule-based / placeholder logic for:

Chatbot responses.
Image relevance checks.
Misinformation detection.
Authentication and protected routes are handled using custom Express middleware.


These components are designed to be replaced with real AI/ML models or external API integrations in later phases.