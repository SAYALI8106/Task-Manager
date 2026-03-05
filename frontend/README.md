# Task Manager

A task management web application built using **React + Vite + TypeScript + Tailwind CSS**.  
This application helps users manage tasks efficiently with priority handling, filtering, and instant UI feedback.

## Features

- Add new tasks with priority (**Low / Medium / High**)
- Mark tasks as **Done / Undone**
- Delete tasks with confirmation dialog
- Inline task editing
- Sort tasks by priority
- Filter tasks:
  - Active (default)
  - Done
  - All
- Confetti animation on task completion
- Toast notifications for user actions
- Persistent storage using **localStorage**

## Tech Stack

- **React**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- `react-confetti`
- `react-toastify`
- `react-use`

## Installation & Setup

1. Clone the repository

   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory

   ```bash
   cd sayali-gayke/frontend
   ```

3. Local setup

   ```bash
   cp .env.example .env
   npm install
   ```

   Set the appropriate values for all environment variables in `.env` file.

4. Run the development server

   ```bash
   npm run dev
   ```

5. To manually compile and watch TypeScript errors, run

   ```bash
   tsc --noEmit --watch
   ```
