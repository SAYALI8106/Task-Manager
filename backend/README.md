# Backend server for Task Manager

## Initial setup

```sh
npm install

# Set the appropriate values for all environment variables in `.env` file.
cp .env.example .env

# Run pending migrations
 npx prisma migrate dev

# Regenerate Prisma client
npx prisma generate
```

To seed database with sample data

```sh
npx prisma db seed
```

## Local development

To start local server, run

```sh
npm run dev
```

And then access the server running at http://localhost:5001.

```sh
curl http://localhost:5001
```

To start the Prisma Studio (to interact with the database),

```sh
npx prisma studio
```

## Tasks API Endpoints

| Method | Endpoint                | Description                                        |
| ------ | ----------------------- | -------------------------------------------------- |
| GET    | `/api/health`           | Health check for the server                        |
| GET    | `/api/tasks`            | Get all tasks                                      |
| GET    | `/api/tasks?q=`         | Search tasks by name                               |
| GET    | `/api/tasks?priority=`  | Filter tasks by priority (`low`, `medium`, `high`) |
| GET    | `/api/tasks?done=`      | Filter tasks by completion status                  |
| GET    | `/api/tasks/:id`        | Get a task by ID                                   |
| POST   | `/api/tasks`            | Create a new task                                  |
| PUT    | `/api/tasks/:id`        | Update an existing task                            |
| PATCH  | `/api/tasks/:id/toggle` | Toggle task completion                             |
| DELETE | `/api/tasks/:id`        | Delete a task                                      |
| GET    | `/api/tasks/stats`      | Get task statistics                                |

## Test Setup

Jest is configured to run tests written in TypeScript.  
Test files are located inside the `__tests__` directory.

### Run All Tests

```sh
npm test
```

## Access Swagger UI

Once the server is running, open Swagger UI at:

```bash
http://localhost:5001/api/docs
```
