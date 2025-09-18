# 📝 Multi-Tenant SaaS Notes App

A SaaS Notes Application with multi-tenancy, role-based access, and subscription plans, built using React (TS), Node.js, Express, and MongoDB, deployed on Vercel.

## 🚀 Features

- **Multi-Tenancy** with strict data isolation
- **JWT Authentication** (Admin & Member roles)
- **Subscription Plans:**
  - **Free** → max 3 notes
  - **Pro** → unlimited notes
- **CRUD APIs** for Notes
- **Minimal frontend** with login, notes management, and upgrade option

## 🏗️ Multi-Tenancy Approach

**Chosen:** Shared Schema with `tenantId` column

**Reason:**
- ✅ Easiest to implement with MongoDB
- ✅ Single schema, simple queries with `{ tenantId }` filter
- ✅ Less infrastructure overhead, good for small/medium SaaS
- ❌ Schema-per-tenant and DB-per-tenant add complexity, overhead, and are overkill for this scale

## 👥 Test Accounts

All with password: `password`

- `admin@acme.test` → Admin, Tenant: Acme
- `user@acme.test` → Member, Tenant: Acme
- `admin@globex.test` → Admin, Tenant: Globex
- `user@globex.test` → Member, Tenant: Globex

## 🔑 Endpoints

### Health
- `GET /health` → `{ "status": "ok" }`

### Auth
- `POST /auth/login` → Login with email + password

### Tenants
- `POST /tenants/:slug/upgrade` → Upgrade to Pro (Admin only)

### Notes
- `POST /notes` → Create note (enforces plan limits)
- `GET /notes` → List all notes for current tenant
- `GET /notes/:id` → Get a specific note
- `PUT /notes/:id` → Update a note
- `DELETE /notes/:id` → Delete a note

## ⚡ Tech Stack

- **Frontend:** React + TypeScript
- **Backend:** Node.js + Express.js
- **Database:** MongoDB (with tenantId)
- **Deployment:** Vercel

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/siddardha003/Yardstick.git
   cd Yardstick
   ```
   
2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your MongoDB connection and JWT secret in .env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: `http://localhost:5173`
   - Backend: `http://localhost:4000`

## 📁 Project Structure

```
Yardstick/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, tenant isolation
│   │   └── config/          # Database configuration
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── context/         # React context
│   │   └── styles/          # CSS files
│   └── package.json
└── README.md
```

## 👨‍💻 Author

**Siddardha** - [GitHub](https://github.com/siddardha003)