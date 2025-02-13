# Event Booking Backend

This is the backend service for the **Event Booking & Management** app, built as part of the **WPU COURSE**. This project follows the **MERN stack** approach, utilizing **Express.js** with **TypeScript** to create a scalable and efficient backend.

## Features
- User authentication & authorization (JWT-based)
- Event creation, updating, and deletion
- Booking system for users
- Payment integration (if applicable)
- API endpoints following RESTful conventions

## Tech Stack
- **Node.js** & **Express.js** (Framework)
- **TypeScript** (Static typing)
- **MongoDB** (Database)
- **Mongoose** (ODM for MongoDB)
- **JSON Web Tokens (JWT)** (Authentication)
- **Dotenv** (Environment variables management)

## Installation & Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-username/event-booking-backend.git
   cd event-booking-backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add necessary variables (e.g., database connection string, JWT secret, etc.).

4. Run the development server:
   ```sh
   npm run dev
   ```

## Scripts
- `npm run dev` - Runs the server in development mode with **nodemon**
- `npm run build` - Compiles TypeScript to JavaScript
- `npm start` - Runs the compiled JavaScript files

## API Endpoints (Example)
| Method | Endpoint         | Description         |
|--------|----------------|---------------------|
| GET    | `/api/events`  | Fetch all events   |
| POST   | `/api/events`  | Create an event    |
| GET    | `/api/bookings` | Fetch user bookings |
| POST   | `/api/bookings` | Book an event      |

## Contributing
Feel free to fork and contribute by submitting a pull request.

## License
This project is open-source and available under the **MIT License**.

