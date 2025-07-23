# Backend – Portfolio API

This is the **Express.js backend** for the portfolio site, using MongoDB for storage and JWT for authentication.

---

## 🚀 Features

- REST API for portfolio content
- MongoDB with Mongoose ODM
- JWT-based authentication (future use)
- Contact form endpoint for user messages

---

## 📂 Structure

```
/backend
  ├── src
  │   ├── config       # Database connection
  │   ├── controllers  # Business logic
  │   ├── routes       # API endpoints
  │   ├── middleware   # Auth checks
  │   └── server.js    # Entry point
```

---

## ⚙️ Setup

```bash
pnpm install
pnpm run dev
```

---

## ✅ Environment Variables

Create `.env` in `backend`:

```
PORT=5000
MONGO_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```

---

## 🔑 API Endpoints

### Projects

```
GET    /api/projects        # Fetch all projects
GET    /api/projects/:id    # Fetch single project
```

### Contact

```
POST   /api/contact         # Submit contact form
```

---

## 🧰 Commands

| Command        | Description              |
| -------------- | ------------------------ |
| `pnpm run dev` | Start server in dev mode |
| `pnpm start`   | Start in production      |

---

## 🛡 Security

- JWT for authentication (future use)
- CORS enabled for frontend
- Input validation with middleware
