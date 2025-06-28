# Stock Management Project

A full-stack stock management application with a **NestJS** backend (server) and a **React** frontend (client).  
It allows users to register, log in, manage their stock portfolio, and search for stock data using the FMP API.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Server Setup](#server-setup)
  - [Client Setup](#client-setup)
- [API Endpoints](#api-endpoints)
- [License](#license)

---

## Features

- User registration and authentication (JWT)
- Portfolio management (add, update, remove stocks)
- Real-time stock search and details (via FMP API)
- Pagination and filtering
- Responsive UI with Ant Design
- Error handling and notifications

---

## Tech Stack

- **Backend:** [NestJS](https://nestjs.com/), [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)
- **Frontend:** [React](https://react.dev/), [MobX](https://mobx.js.org/), [Ant Design](https://ant.design/)
- **API:** [Financial Modeling Prep (FMP)](https://financialmodelingprep.com/developer/docs/)

---

## Project Structure

```
stock-management/
├── server/        # NestJS backend
│   ├── src/
│   ├── .env
│   └── ...
├── stock-portfolio-fe/  # React frontend
│   ├── src/
│   └── ...
└── README.md
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) running locally or in the cloud

---

### Environment Variables

#### Server (`server/.env`)

```
MONGO_URI=mongodb://localhost:27017/stock-management
FMP_API_KEY=your_fmp_api_key
PORT=3000
NODE_ENV=dev
JWT_SECRET=your_jwt_secret
```

#### Client

If you need to configure the API URL, create a `.env` file in `stock-portfolio-fe`:

```
REACT_APP_API_URL=http://localhost:3000
```

---

### Server Setup

```bash
cd server
npm install
# or yarn
npm run start:dev
```

The server will run on `http://localhost:3000` by default.

---

### Client Setup

```bash
cd stock-portfolio-fe
npm install
# or yarn
npm start
```

The client will run on `http://localhost:3001` (or another available port).

---

## API Endpoints

### Auth

- `POST /auth/register` — Register a new user
- `POST /auth/login` — Log in and receive a JWT token
- `GET /auth/me` — Get current user info (JWT required)
- `POST /auth/logout` — Log out

### Portfolio

- `GET /portfolio` — Get user's portfolio (paginated)
- `POST /portfolio` — Add a stock to portfolio
- `PUT /portfolio/:symbol` — Update a stock in portfolio
- `DELETE /portfolio/:symbol` — Remove a stock from portfolio

### Stocks

- `GET /stocks` — Search stocks (symbol, name, exchange)
- `GET /stocks/:symbol` — Get stock details

---

## License

This project is licensed under the MIT
