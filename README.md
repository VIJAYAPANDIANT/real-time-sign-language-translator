# SignLang AI - Real-Time Sign Language Translator

SignLang AI is a full-stack, real-time American Sign Language (ASL) translator. The web application allows users to capture sign language gestures using their webcam, translates the movements into text via a high-performance backend, and displays translation history and profiles for authenticated users.

## ✨ Features

- **Real-Time translation:** Streams webcam frames or landmarks over WebSockets to an inference backend (using MediaPipe) for instant sign-to-text translation.
- **Secure Authentication Flow:** 
  - Complete user registration (with username, email, and password) and sign-in pages.
  - Session persistence using JWT tokens stored securely in the client's local storage.
  - Protected routes (`/translate`, `/history`, and `/settings`) to prevent unauthorized access.
- **Glassmorphic Responsive UI:** A premium, responsive user interface styled with custom CSS, featuring:
  - Dynamic navigation header that adapts to login state.
  - Mobile-friendly navbar layout.
- **Translation History & Settings:** Access past translation sessions, user preferences, and profile configurations.

## 🛠️ Architecture & Tech Stack

- **Frontend:** React (TypeScript) + Vite, Custom Vanilla CSS, Lucide React Icons.
- **Backend:** Python FastAPI, SQLAlchemy (ORM), WebSockets for real-time frame transmission.
- **Real-Time CV Pipeline:** MediaPipe Hands + Pose for landmark extraction and LSTM/Transformer model in backend for gesture sequence predictions.
- **Database:** SQLite (local development) / PostgreSQL.
- **Deployment & Containerization:** Docker, Docker Compose, Vercel (for frontend).

## 📁 Folder Structure

- `/frontend`: Vite-powered React application.
- `/backend`: FastAPI application containing auth routes, session management, and WebSocket endpoints.
- `/ml`: Machine learning training pipeline, landmark extraction models, and trained weights.

## 🚀 Running Locally

### Prerequisites
- Docker & Docker Compose installed.
- Node.js (v18+) and Python 3.10+ (if running manually without Docker).

### Option A: Using Docker (Recommended)
1. Clone this repository.
2. Build and run the services from the root folder:
   ```bash
   docker-compose up --build
   ```
3. Open `http://localhost:5173` in your browser.

### Option B: Manual Setup

#### Backend
1. Navigate to `/backend`.
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Run the development server:
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend
1. Navigate to `/frontend`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## 🔐 Environment Variables

- **Frontend:** Rename `/frontend/.env.example` to `/frontend/.env` and update API endpoints.
- **Backend:** Rename `/backend/.env.example` to `/backend/.env` and set your `SECRET_KEY` and database configuration.

