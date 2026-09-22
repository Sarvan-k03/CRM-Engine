# 🚀 CRMEngine

**A modern, full-stack CRM built on the MERN stack for tracking leads, managing sales pipelines, and visualizing performance in real time.**

CRMEngine helps sales teams organize contacts, move deals through customizable pipeline stages, and monitor growth through a live analytics dashboard — all wrapped in a fast, responsive interface.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node.js-%3E%3D18.x-green)
![React](https://img.shields.io/badge/React-Vite-61DAFB)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248)

---

## 📋 Table of Contents

- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Setup & Installation](#-setup--installation)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [License & Author](#-license--author)

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- Secure user registration and login using **JSON Web Tokens (JWT)**
- **Protected routes** on both client and server — unauthorized requests are rejected at the middleware level
- **Session persistence** via React **Context API**, so users stay logged in across page refreshes
- Passwords hashed with **bcryptjs** before storage — plaintext credentials never touch the database

### 📊 Dynamic Dashboard Analytics
- Real-time calculation of key metrics (total leads, conversion rate, leads by stage)
- **Recent leads feed** showing the latest activity as it happens
- Aggregated data served through a dedicated analytics API for fast, lightweight rendering

### 📇 Complete Lead Management (CRUD)
- Create, read, update, and delete leads with full **form validation** on both frontend and backend
- Structured lead records (name, company, email, phone, status, notes) with Mongoose schema enforcement
- Instant UI feedback on successful or failed operations

### 🗂️ Visual Kanban / Pipeline Board
- Drag-and-drop style pipeline view with clearly defined stages: **New → Contacted → Qualified → Closed**
- Leads update their stage in the database the moment they're moved
- At-a-glance view of pipeline health and bottlenecks

### 🎨 Modern UI/UX
- Styled entirely with **Tailwind CSS** for a clean, consistent design system
- Fully **responsive layout** — works seamlessly across desktop, tablet, and mobile
- Persistent **sidebar navigation** powered by **React Router**, enabling smooth client-side transitions

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React.js (Vite)** | Component-based UI with fast dev/build tooling |
| **Tailwind CSS** | Utility-first styling and responsive design |
| **React Router DOM** | Client-side routing and navigation |
| **Axios / Fetch API** | HTTP requests to the backend REST API |
| **Context API** | Global auth/session state management |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime for the server |
| **Express.js** | REST API framework and routing |
| **MongoDB** | NoSQL document database |
| **Mongoose** | ODM for schema modeling and validation |
| **JSON Web Tokens (JWT)** | Stateless authentication |
| **bcryptjs** | Password hashing |

---

## ✅ Prerequisites

Before running CRMEngine locally, make sure you have the following installed:

- **Node.js** `v18.x` or higher — [Download](https://nodejs.org/)
- **npm** `v9.x` or higher (bundled with Node.js)
- **MongoDB** — either:
  - A local instance ([MongoDB Community Server](https://www.mongodb.com/try/download/community)), or
  - A free cloud cluster via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** — [Download](https://git-scm.com/)
- A code editor such as **VS Code** or a **GitHub Codespaces** environment

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/crmengine.git
cd crmengine
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Populate `backend/.env` with the following variables:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/crmengine
JWT_SECRET=your_super_secret_jwt_key
```

Start the backend server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### 3. Frontend Setup

Open a **new terminal window**:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create your environment file
cp .env.example .env
```

Populate `frontend/.env` with the following variable:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The app will be running at `http://localhost:5173` (default Vite port).

### 4. You're Ready! 🎉

Open your browser to the frontend URL, register a new account, and start managing leads.

---

## 📁 Project Structure

```
crmengine/
├── backend/
│   ├── config/
│   │   └── db.js                # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js    # Register/login logic
│   │   ├── leadController.js    # Lead CRUD logic
│   │   └── analyticsController.js
│   ├── middleware/
│   │   ├── authMiddleware.js    # JWT verification / route protection
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js              # Mongoose user schema
│   │   └── Lead.js              # Mongoose lead schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── leadRoutes.js
│   │   └── analyticsRoutes.js
│   ├── .env.example
│   ├── server.js                # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── LeadTable.jsx
│   │   │   ├── LeadForm.jsx
│   │   │   └── PipelineBoard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global auth/session state
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Leads.jsx
│   │   │   └── Pipeline.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🔌 API Endpoints

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user account | Public |
| `POST` | `/api/auth/login` | Authenticate a user and return a JWT | Public |

### Lead Routes — `/api/leads`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/leads` | Retrieve all leads for the authenticated user | Private |
| `GET` | `/api/leads/:id` | Retrieve a single lead by ID | Private |
| `POST` | `/api/leads` | Create a new lead | Private |
| `PUT` | `/api/leads/:id` | Update an existing lead (including pipeline stage) | Private |
| `DELETE` | `/api/leads/:id` | Delete a lead | Private |

### Analytics Routes — `/api/analytics`

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/analytics/dashboard` | Retrieve aggregated dashboard metrics (totals, stage breakdown, recent leads) | Private |

> **Note:** All `Private` routes require a valid JWT passed via the `Authorization: Bearer <token>` header.

---


## 🗺 Roadmap

Planned enhancements for future releases:

- [ ] **CSV Lead Import** — bulk upload leads from spreadsheet files
- [ ] **Automated Email Sequences** — trigger follow-up emails based on lead stage
- [ ] **Zapier / Webhook Integrations** — connect CRMEngine to third-party tools and automations
- [ ] **Role-Based Access Control (RBAC)** — admin vs. sales rep permission tiers
- [ ] **Advanced Reporting** — exportable PDF/CSV reports and custom date-range filtering

---

## 📄 License & Author

### License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### Author

**[Sarvan Kumar]**
📧 [sk.sarvan1111@gmail.com](mailto:sk.sarvan1111@gmail.com)

---

<p align="center">Built with ❤️ using the MERN stack</p>
