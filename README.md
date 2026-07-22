# Fundsroom ERP CRM

An enterprise-grade **Mini ERP & CRM System** designed to streamline customer management, inventory control, sales challan generation, and role-based operational analytics.

---

## 🚀 Overview

**Fundsroom ERP CRM** provides a unified platform for distinct organizational roles (Admin, Sales, Warehouse, Accounts). Built with modern full-stack web technologies, it features automated stock movement tracking, real-time inventory alerts, sales challan creation, customer lead management, and role-based access control (RBAC).

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** TailwindCSS + Lucide React Icons
- **Routing:** React Router v6
- **HTTP Client:** Axios with JWT Interceptors & Mock Fallback Mechanism

### Backend
- **Runtime:** Node.js + Express (TypeScript)
- **Database ORM:** Prisma Client v6
- **Database:** PostgreSQL (Hosted on Neon DB)
- **Authentication:** JWT (JSON Web Tokens) + Bcrypt Password Hashing

---

## 📁 Repository Structure

```
fundsroom-erp-crm/
├── backend/                  # Node.js + Express + Prisma API server
│   ├── prisma/               # Prisma Database Schema & Migrations
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/           # Prisma & Env Configurations
│   │   ├── controllers/      # Route Controllers
│   │   ├── middleware/       # Auth, Role Guard, Error Middleware
│   │   ├── routes/           # Express Route Definitions
│   │   ├── services/         # Business Logic Layer
│   │   ├── app.ts            # Express App Configuration
│   │   └── server.ts         # Server Entry Point
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                 # React + Vite TypeScript SPA
│   ├── src/
│   │   ├── components/       # Common, Layout, & Guard Components
│   │   ├── context/          # React Context (AuthContext)
│   │   ├── pages/            # Role Dashboards & Feature Views
│   │   ├── services/         # API Service Layer & Axios Client
│   │   ├── types/            # TypeScript Interfaces & Enums
│   │   ├── App.tsx           # App Router & Layout Shell
│   │   └── main.tsx          # Application Mounting
│   ├── .env                  # Frontend Environment Variables
│   ├── package.json
│   └── vite.config.ts
│
└── docs/                     # Detailed Project Documentation
    ├── ARCHITECTURE.md       # Technical Architecture & DB Schema
    ├── API_DOCUMENTATION.md  # REST API Reference
    ├── SETUP_GUIDE.md        # Local Setup & Deployment Guide
    └── FEATURES_AND_ROLES.md # Role-Based Access Control & Modules
```

---

## 👥 Role-Based Access Control (RBAC)

The platform supports 4 distinct user roles:

| Role | Access Scope | Key Features |
| :--- | :--- | :--- |
| **`ADMIN`** | Full System Access | User management, settings, system audit, all operational pages |
| **`SALES`** | Customer & Sales Scope | Customer lead tracking, follow-ups, Sales Challan generation |
| **`WAREHOUSE`** | Stock & Inventory Scope | Product management, stock IN/OUT logging, low stock alerts |
| **`ACCOUNTS`** | Financials & Reports Scope | Sales reporting, revenue metrics, financial dashboards |

---

## ⚡ Quick Start

### 1. Prerequisites
- Node.js (v18+)
- npm or yarn
- PostgreSQL instance (or Neon DB account)

### 2. Environment Setup

#### Backend (`backend/.env`):
```env
PORT=5000
DATABASE_URL="postgresql://user:password@host/neondb?sslmode=require"
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000
```

### 3. Installation & Running

```bash
# Clone the repository
git clone https://github.com/Shivani-Bajjuri/fundsroom-erp-crm.git
cd fundsroom-erp-crm

# Install and start Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev

# Install and start Frontend (in a separate terminal)
cd ../frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:5173` and backend at `http://localhost:5000`.

---

## 📚 Comprehensive Documentation

For complete technical documentation, refer to the [`docs/`](file:///d:/projects/fundsroom-erp-crm/docs) directory:
- 🏗️ [Architecture & Database Schema](file:///d:/projects/fundsroom-erp-crm/docs/ARCHITECTURE.md)
- 🔌 [API Endpoint Reference](file:///d:/projects/fundsroom-erp-crm/docs/API_DOCUMENTATION.md)
- ⚙️ [Setup & Deployment Guide](file:///d:/projects/fundsroom-erp-crm/docs/SETUP_GUIDE.md)
- 🔒 [Features & Role Access Matrix](file:///d:/projects/fundsroom-erp-crm/docs/FEATURES_AND_ROLES.md)
