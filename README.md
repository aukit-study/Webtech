# Furnish E-commerce Platform

A full-stack e-commerce web application built with a modern architecture, providing a seamless shopping experience. It features user authentication, a product catalog, cart management, and a secure checkout process.

## 🏗 Architecture & Tech Stack

### Frontend (Client-Side)
- **HTML5/CSS3**: Semantic HTML with responsive design.
- **Vanilla JavaScript (ES6+)**: Handles dynamic UI interactions, fetch API calls, and state management without heavy frameworks.
- **Bootstrap 5**: Utilized for rapid and responsive UI component development (customized and purged for performance).
- **Swiper.js**: Implements touch-friendly product and hero carousels.

### Backend (Server-Side)
- **Node.js & Express.js**: Powers the RESTful API, handling routing, middleware, and business logic.
- **SQLite3**: A lightweight, file-based relational database, perfect for rapid development and moderate workloads.
- **JWT (JSON Web Tokens)**: Secure, stateless user authentication and session management.
- **Bcrypt**: Password hashing to ensure user credential security.

### Project Structure (Layered Architecture)
The backend follows a clean, layered architecture separating concerns for maintainability:
- **`server/routes/`**: Defines API endpoints and maps them to controllers.
- **`server/controllers/`**: Handles incoming HTTP requests, processes input, and calls services.
- **`server/services/`**: Contains core business logic.
- **`server/repositories/`**: Manages direct database interactions (Data Access Layer).
- **`server/data/`**: JSON seed data for initial product catalog.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/aukit-study/Webtech.git
   cd Webtech
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Copy the example environment file and configure your secrets:
   ```bash
   cp .env.example .env
   ```
   *Edit `.env` to set your `PORT` and a secure `JWT_SECRET`.*

4. **Run the Development Server**
   ```bash
   npm run start
   ```

5. **Access the application**
   Open your browser and navigate to `http://localhost:3000` (or your configured PORT).

---

## 🔒 Security Practices
- **Environment Variables**: Sensitive data like JWT secrets are stored in `.env` (ignored by Git) using the `dotenv` package.
- **Password Hashing**: User passwords are encrypted using `bcrypt` before database storage.
- **CORS Configuration**: Restricts cross-origin API access.

## 👨‍💻 Development & Scripts
- `npm run start`: Starts the Node.js server.
- `npm run build:css`: Compiles Sass to CSS.
- `npm run watch:css`: Watches for Sass changes.

*Designed and developed by the CodesCandy team. Modified by the current author.*
