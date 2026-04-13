# 🚀 TaskFlow

A minimal full-stack task management system with authentication, project management, and task tracking.

---

## 🧰 Tech Stack

* **Frontend:** React (Vite)
* **Backend:** Go (Gin)
* **Database:** PostgreSQL
* **Containerization:** Docker & Docker Compose

---

## ✨ Features

* 🔐 JWT-based authentication
* 📁 Create and manage projects
* ✅ Add and track tasks
* 🐳 Fully dockerized setup

---

## 🚀 Running Locally

### 1️⃣ Clone the repository

```bash
git clone https://github.com/TanishqCh07/TaskFlow.git
cd TaskFlow
```

---

### 2️⃣ Start all services

```bash
docker compose up --build
```

---

### 3️⃣ Setup database (run in new terminal)

```bash
docker exec -it taskflow_db psql -U postgres -d taskflow
```

Then run:

```sql
\i /schema.sql
\i /seed.sql
\q
```

---

### 4️⃣ Access the application

* 🌐 Frontend: http://localhost:5173
* 🔗 Backend: http://localhost:8080

---

## 🔐 Test Credentials

```text
Email:    test@example.com
Password: password123
```

---

## 📌 Notes

* Ensure Docker Desktop is running before starting
* All services are managed via `docker-compose`
* Database schema and seed data are included

---

## 👨‍💻 Author

**Tanishq Chaurasia**

---

## 📄 License

This project is for assessment purposes.
