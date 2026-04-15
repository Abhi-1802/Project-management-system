# 🚀 Mini Project Management System

A full-stack **Project Management System** built with **Node.js, Express, MongoDB, and React (TypeScript)**.

---

## 🌐 Live Demo

🔗 **Frontend (Vercel):**
https://project-management-system-tau-rose.vercel.app/

🔗 **Backend (Render API):**
https://project-management-system-vpnn.onrender.com

Postman Collection is inside Backend Folder
---

## 📌 Features

### 🔐 Authentication

* User Registration (Name, Email, Password)
* Secure Login with JWT
* Password hashing using bcrypt

---

### 📁 Project Management

* Create Project
* View all projects (user-specific)
* Update Project
* Delete Project

---

### ✅ Task Management

* Add Task to Project
* Get Tasks (with pagination)
* Update Task
* Delete Task
* Filter tasks by status

---

## 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication

### Frontend

* React (TypeScript)
* Axios

---

## ⚙️ Setup Instructions

### Clone the Repository

```bash
git clone https://github.com/Abhi-1802/Project-management-system.git
cd Project-management-system
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env`:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
```

Run:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔗 API Base URL

```
https://project-management-system-vpnn.onrender.com/api
```

---

## ⚠️ Notes

* Backend hosted on Render (may take a few seconds to wake up)
* MongoDB Atlas used for database
* Ensure CORS is enabled for frontend URL

---

## 👨‍💻 Author

Abhishek
