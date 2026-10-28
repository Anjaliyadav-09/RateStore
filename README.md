
# RateStore — Store Rating Management System

A full-stack web application that allows users to discover stores, submit ratings, and manage their accounts. Administrators can manage users, stores, and ratings through an admin dashboard.

## Features

### User Features
- User registration and login
- Secure password hashing and JWT-based authentication
- Browse and search stores
- Submit and update store ratings
- View store ratings and account details
- Password reset functionality

### Store Owner Features
- Access a dedicated Store Owner Dashboard.
- View owned store details, including store name, address, and email.
- Monitor the store's average rating and total number of ratings.
- View rating distribution across 1-star to 5-star ratings.
- View customer ratings submitted for the store.
- See customer details, including name and email, along with their rating and rating date.
- Refresh the dashboard to load updated store rating information.

### Admin Features
- Admin dashboard with summary statistics
- Manage and search users
- Add, edit, search, and delete stores
- View and manage ratings
- Filter and sort store information
- Role-based access control

## Tech Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT Authentication

**Database**
- MySQL

**Tools**
- Git and GitHub
- VS Code
- Postman

## Project Structure

```text
Store_Rating_System/
├── backend/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following:
- Node.js and npm
- MySQL Server
- Git

### 1. Clone the repository

```bash
git clone https://github.com/Anjaliyadav-09/RateStore.git
cd RateStore
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend/` directory and configure the environment variables required by your backend code.

Example placeholders:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_system
JWT_SECRET=your_secure_jwt_secret
```

**Important:** These are example placeholders. Use the exact variable names expected by your code and never commit real credentials.

### 3. Start the backend

```bash
npm start
```

Use the start command defined in `backend/package.json` if it differs.

### 4. Configure and start the frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite in your terminal.

Configure the frontend API URL according to your backend configuration.

## Security

- Keep `.env` files and credentials out of Git.
- Use strong JWT secrets.
- Never expose database passwords or email credentials in frontend code.
- Validate and authorize protected API requests.

## Future Improvements

- Deploy the application with a live frontend and backend
- Add automated tests
- Improve accessibility and responsive design
- Add additional rating analytics

## Author

**Anjali Yadav**

GitHub: [Anjaliyadav-09](https://github.com/Anjaliyadav-09)

---

If you find this project useful, consider giving the repository a star.
