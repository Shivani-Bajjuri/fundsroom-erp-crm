# Setup & Deployment Guide

This guide covers local environment setup, Prisma database migrations, building, and deploying **Fundsroom ERP CRM**.

---

## 🛠️ Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **PostgreSQL**: Neon DB connection string or local PostgreSQL instance

---

## ⚙️ Environment Variables Setup

### 1. Backend (`backend/.env`)

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
DATABASE_URL="postgresql://neondb_owner:password@ep-soft-meadow-awf0lyu5.c-12.us-east-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET=your_secure_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

### 2. Frontend (`frontend/.env`)

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
# For production deployment (e.g. Render):
# VITE_API_URL=https://fundsroom-oxsc.onrender.com
```

---

## 🚀 Local Development Setup

### Step 1: Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Database Setup & Prisma Generation
```bash
cd ../backend

# Generate Prisma Client types
npx prisma generate

# Sync Database Schema with database
npx prisma db push
```

### Step 3: Run Development Servers
In Terminal 1 (Backend):
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

In Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
# Running on http://localhost:5173
```

---

## 📦 Build for Production

### Backend Build
```bash
cd backend
npm run build
```
This compiles TypeScript to JavaScript into the `backend/dist` folder. Run production backend using:
```bash
npm run start
```

### Frontend Build
```bash
cd frontend
npm run build
```
This creates static production assets in `frontend/dist`.

---

## 🌐 Deployment Guidelines

### Backend Deployment (Render / Railway)
- **Root Directory:** `backend`
- **Build Command:** `npm install && npx prisma generate && npm run build`
- **Start Command:** `npm run start`
- **Environment Variables:** Set `DATABASE_URL`, `JWT_SECRET`, `PORT`, and `CLIENT_URL`.

### Frontend Deployment (Vercel / Netlify / Render Static Site)
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Environment Variables:** Set `VITE_API_URL`.
