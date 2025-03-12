# ExpensiFy

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Setup and Installation](#setup-and-installation)
5. [API Documentation](#api-documentation)

## Project Overview
ExpensiFy is a full-stack Expense Tracker and Budget Management System where users can register, 
log in, and manage their expenses and budgets. The application will allow users to categorize 
expenses, set budget limits, and generate reports.


![ExpensiFy](/client/public/logo.svg)

The project is structured as a monorepo with two main directories:
- `client`: The frontend application built with React
- `server`: The backend API server built with Node.js and Express

## Technology Stack

### Frontend (client)
- React.js (Typescript)
- React Router for navigation
- Tanstack Query for streamlined data fetching and mutations
- React-Hook-Form for Form Validations
- Tailwind CSS and Shadcn UI for styling
- TypeScript for type-safety 

### Backend (server)
- Node.js (Typescript)
- TypeScript for type-safety 
- Express.js
- Postgres (Supabase) for database solutions
- Prisma ORM for database interactions

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/dexterousdhruv/Expensify.git
   cd Expensify
   ```

2. Install dependencies for both packages:
   ```
   cd client
   npm install -f

   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `client` directory
   - Create a `.env` file in the `api` directory
   - For the frontend (`client/.env`) (Refer to `client/.env.example`):
     ```
     VITE_API_URL=http://localhost:3000 (Replace with hosted backend url)
     ```

   - For the backend (`api/.env`) (Refer to `server/.env.example`):
     ```
     PORT=3000
     JWT_SECRET="" (Your jwt secret key)
     DATABASE_URL="" (Replace with Supabase (Postgres) connection string for Prisma)
     BASE_URL=http://localhost:3000 (Replace with hosted backend url)
     CLIENT_URL=http://localhost:5173 (Replace with hosted frontend url)

     ```

4. Start the development servers:
   - For the frontend:
     ```
     cd client
     npm run dev
     ```
   - For the backend:
     ```
     cd backend
     npm run dev
     ```



