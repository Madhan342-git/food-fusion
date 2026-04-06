🍔 Food App – Full Stack Application

A modern Full Stack Food Application with separate Frontend, Admin Panel, and Backend services. This project supports authentication, admin management, payments, email services, and scalable API architecture.

📂 Project Structure
food/
│
├── backend/        # Node.js + Express API
├── frontend/       # User-facing application (Vite + React)
├── admin/          # Admin dashboard (Vite + React)
🚀 Tech Stack
Frontend & Admin

⚛️ React (Vite)

🎨 Modern UI

🌐 Axios for API calls

Backend

🟢 Node.js

🚂 Express.js

🍃 MongoDB

🔐 JWT Authentication

💳 Stripe Payments

✉️ SMTP / Email Services

🔥 Firebase (optional integrations)

⚙️ Environment Configuration
🧑‍💼 Admin Panel (admin/.env)
VITE_BACKEND_URL=http://localhost:4000
🌐 Frontend (frontend/.env)
VITE_BACKEND_URL=http://localhost:4000
🖥️ Backend (backend/.env)
JWT_SECRET=change_me
JWT_EXPIRY=365d
PORT=4000
NODE_ENV=development
STRIPE_SECRET_KEY=
MONGODB_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_EMAIL=
SMTP_PASSWORD=
EMAIL_USER=
EMAIL_PASS=
FIREBASE_TYPE=service_account
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=
ADMIN_EMAIL=
ADMIN_DEFAULT_PASSWORD=112233
JWT_ADMIN_SECRET=change_me
ADMIN_TOKEN_EXPIRY=365d
FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
CORS_ORIGINS=http://localhost:5173,http://localhost:5174


ADMIN_EMAIL=
ADMIN_DEFAULT_PASSWORD=112233
JWT_ADMIN_SECRET=change_me
ADMIN_TOKEN_EXPIRY=365d


FRONTEND_URL=http://localhost:5173
ADMIN_URL=http://localhost:5174
CORS_ORIGINS=http://localhost:5173,http://localhost:5174

⚠️ Important: Never commit .env files to GitHub. Add them to .gitignore.

▶️ How to Run the Project
1️⃣ Backend Setup
cd backend
npm install
npm run dev

Backend will start at: 👉 http://localhost:4000

2️⃣ Frontend Setup
cd frontend
npm install
npm run dev

Frontend will start at: 👉 http://localhost:5173

3️⃣ Admin Panel Setup
cd admin
npm install
npm run dev

Admin Panel will start at: 👉 http://localhost:5174

🔐 Default Admin Login
Email:    (value from ADMIN_EMAIL)
Password: 112233

Change the default password immediately after first login.

✨ Features

👤 User Authentication (JWT)

🧑‍💼 Admin Dashboard

🍽️ Food Management

🛒 Orders & Cart System

💳 Stripe Payment Integration

✉️ Email Notifications

🔒 Secure API with Role-based Access

📦 Scripts
npm run dev     # Run in development mode
npm run build   # Build for production
npm start       # Start production server
🛡️ Security Notes

Keep secrets safe

Rotate JWT secrets in production

Use HTTPS in deployment

📄 License

This project is for educational and development purposes.

❤️ Author

Developed with passion 🚀

Happy Coding! 🎉
