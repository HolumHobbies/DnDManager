# D&D Campaign Manager

A Next.js application for managing Dungeons & Dragons campaigns with a focus on character sheets.

## Features

- User authentication (login/register) with optional passwords
- Character creation and management
- Dashboard with overview of characters
- Clean UI with reusable components
- API endpoints for CRUD operations

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MySQL/MariaDB with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Development**: Storybook
- **Testing**: Jest, React Testing Library

## Running with Docker

### Prerequisites

- Docker and Docker Compose installed
- The `app_network` Docker network must exist

### Create the Docker Network (if it doesn't exist)

```bash
docker network create app_network
```

### Starting the Application

```bash
# Build and start the containers
docker-compose up -d

# View logs
docker-compose logs -f
```

The application will be available at:
- Next.js App: http://localhost:51478
- Storybook: http://localhost:56142

### Stopping the Application

```bash
docker-compose down
```

## Running Locally (Development)

### Prerequisites

- Node.js (v18 or later)
- MySQL/MariaDB

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the database:
   ```bash
   # Create the database
   mysql -e "CREATE DATABASE IF NOT EXISTS dnd_campaign_manager;"
   
   # Run migrations
   npx prisma migrate dev
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

The application will be available at http://localhost:51478.

### Running Storybook

```bash
npm run storybook
```

Storybook will be available at http://localhost:56142.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Project Structure

- `/src/app`: Next.js app router pages and API routes
- `/src/components`: React components
- `/src/lib`: Utility functions and shared code
- `/prisma`: Database schema and migrations
- `/public`: Static assets

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## License

MIT
