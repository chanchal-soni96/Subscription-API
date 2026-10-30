
# Subscription API

A REST API built with Node.js, Express, PostgreSQL, Zod, and Swagger.

## Requirements

- Node.js 22 or compatible version
- Docker Desktop
- npm

## Installation

```bash
npm install
```

## Start test database

```bash
docker compose -f compose.test.yaml up -d
```

## Start application

```bash
npm run dev
```

The API runs at:

http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | / | API root |
| POST | /api/subscriptions | Create subscription |
| GET | /openapi.json | OpenAPI specification |
| GET | /docs | Swagger UI |
| GET | /health/live | Liveness check |
| GET | /health/ready | Readiness check |

## Run Tests

```bash
npm test
```

## Run E2E Tests

```bash
npm run test:e2e
```

## Generate Coverage Report

```bash
npm run test:coverage
```

The HTML coverage report is generated in the coverage directory.

## Test Database

The project uses Docker Compose to run a separate PostgreSQL test database.

Database: subscription_test  
Port: 5433

## Technologies

- Node.js
- Express.js
- PostgreSQL
- Docker
- Vitest
- Supertest
- Zod
- OpenAPI
- Swagger UI
- GitHub Actions
