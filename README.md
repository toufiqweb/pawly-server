# Pawly Server

A backend API for the Pawly pet adoption platform, built with Express and MongoDB. This server provides secure CRUD operations for pets, featured pets, user listings, and adoption requests, with JWT validation via JWKS.

## Key Features

- REST API built with Express
- MongoDB data storage for pets and adoption requests
- JWT authentication using remote JWKS
- CORS support and JSON request handling
- Pet search, featured pet listing, owner listings, and request management

## Tech Stack

- Node.js
- Express
- MongoDB
- dotenv
- CORS
- jose-cjs (JWT verification)

## Installation

1. Clone the repository or copy the project into your local workspace.
2. Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and define the following variables:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=https://your-client-app.com
```

- `PORT` – server port (default: `4000`)
- `MONGODB_URI` – MongoDB connection string
- `CLIENT_URL` – base URL used to fetch JWKS for token validation

## Running the Server

Start the server with:

```bash
node index.js
```

Then open `http://localhost:4000` to verify the server is running.

## API Endpoints

### Public Endpoints

- `GET /` — health check returns `Hello World!`
- `GET /pets` — list pets, with optional query filters:
  - `search` (name or breed)
  - `species`
  - `age`
  - `size`
  - `email`
- `GET /featured-pets` — return a limited set of featured pets

### Authenticated Endpoints

These endpoints require a valid Bearer token in the `Authorization` header.

- `POST /pets` — add a new pet
- `GET /pets/:id` — get pet details by ID
- `GET /listings` — get pet listings by owner email
- `PATCH /pets/:id` — update pet details
- `DELETE /pets/:petId` — delete a pet
- `POST /adoption-requests` — submit a new adoption request
- `GET /requests` — list adoption requests by user or pet
- `PATCH /requests/:id` — update request status (`approved`, `rejected`, `pending`)
- `DELETE /requests/:id` — delete an adoption request

## Notes

- JWT tokens are verified using `jose-cjs` and a JWKS endpoint at `${CLIENT_URL}/api/auth/jwks`.
- The project expects a MongoDB database named `pawly` with collections `pets` and `requests`.
- The server currently uses Express v5 and supports JSON payloads.

## License

This repository is provided as-is for development and customization.
