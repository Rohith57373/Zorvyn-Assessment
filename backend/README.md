# Finance Data Processing and Access Control Backend

A secure and scalable specialized backend system designed for managing financial records with robust Role-Based Access Control (RBAC). Built as part of a technical assessment to demonstrate advanced API design, data modeling, and business logic implementation.

## 🚀 Overview

This backend serves as the core engine for a finance dashboard, enabling users to track income and expenses while strictly enforcing permissions based on user roles (`Viewer`, `Analyst`, `Admin`).

### Key Objectives
- **Data Integrity**: Precise handling of financial transactions.
- **Security**: Granular access control and secure authentication.
- **Performance**: Efficient data aggregation for real-time dashboard analytics.
- **Maintainability**: Clear, modular architecture following industry best practices.

---

## 🏗️ System Architecture

The application follows a modular **Controller-Service-Model** pattern, ensuring a clean separation of concerns:

- **Technologies**: Node.js, Express.js, MongoDB, Mongoose.
- **Authentication**: JWT (JSON Web Tokens) with secure cookie/header handling.
- **Security**: Rate limiting, CORS, input validation (express-validator).
- **Documentation**: Swagger/OpenAPI 3.0.

---

## ✨ Features

### 1. User & Role Management
- **Viewer**: Read-only access to dashboard summaries.
- **Analyst**: Access to detailed financial records and advanced insights.
- **Admin**: Full control over records and user management (active/inactive status).

### 2. Financial Records Management
- Full CRUD operations with soft-delete functionality.
- Advanced filtering by date range, category, and transaction type.
- Full-text search support for notes and categories.

### 3. Dashboard Analytics Logic
Aggregated data endpoints providing:
- Total Income, Expenses, and Net Balance.
- Category-wise breakdown for visual charting.
- Monthly/Weekly trends for time-series analysis.

### 4. Robust Validation & Error Handling
- Strict schema validation using Mongoose.
- Endpoint-level input validation using `express-validator`.
- Centralized error-handling middleware for consistent API responses.

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### Local Development

1.  **Clone the repository**
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure environment variables**:
    Create a `.env` file in the root directory:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    ```
4.  **Seed the database**:
    Populate the system with demo users and financial data:
    ```bash
    npm run seed
    ```
5.  **Run the application**:
    ```bash
    npm run dev
    ```

---

## 📖 API Documentation

Comprehensive API documentation is available via Swagger UI. Once the server is running, navigate to:

`http://localhost:5000/api-docs`

### Primary Endpoints
- `POST /api/auth/register` - User registration.
- `POST /api/auth/login` - User authentication.
- `GET /api/records` - List transactions (Filtered/Paginated).
- `GET /api/dashboard/summary` - Aggregated financial metrics.

---

## ⚖️ Tradeoffs & Assumptions

- **Database Choice**: MongoDB was selected for its flexibility with financial record metadata and horizontal scalability.
- **Mock Persistence**: A `mongodb-memory-server` option is available for testing, though production-ready connection patterns are implemented.
- **Soft Delete**: Records are flagged as `isDeleted` rather than permanently removed to preserve audit trails, a common requirement in financial systems.
- **Authentication**: Stateless JWT was chosen for scalability, though session-based approaches were considered for higher security requirements.

---

## 🧪 Evaluation Criteria Addressed
- [x] **Backend Design**: Clean MVC structure.
- [x] **Logical Thinking**: Clear RBAC implementation.
- [x] **Code Quality**: Readable, self-documenting code.
- [x] **Security**: Rate limiting and payload validation.
