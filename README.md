# 🐾 Pawly Server

A polished backend API for the Pawly pet adoption ecosystem. This Node.js service offers secure, scalable routes for managing pets, owner listings, and adoption requests, with JWT validation through JWKS.

## ✨ What This Server Provides

- Reliable Express-based REST API
- MongoDB persistence for pets and adoption requests
- Secure JWT authentication via remote JWKS
- CORS-enabled JSON request processing
- Search, featured pets, owner-specific listings, and request lifecycle handling

## 🛠️ Tech Stack

- Node.js
- Express
- MongoDB
- dotenv
- cors
- jose-cjs

## 🚀 Installation

1. Clone the repository or place the project in your local workspace.
2. Install dependencies:

```bash
npm install
```

## 🔐 Environment Configuration

Create a `.env` file in the project root and set these values:

```env
PORT=4000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=https://your-client-app.com
```

- `PORT` — port used by the server (default: `4000`)
- `MONGODB_URI` — connection string for MongoDB
- `CLIENT_URL` — client URL used to resolve the JWKS endpoint

## ▶️ Run the Server

Launch the server with:

```bash
node index.js
```

Then confirm it is running at `http://localhost:4000`.

## 📦 API Endpoints

### Public Endpoints

- `GET /` — health check returns `Hello World!`
- `GET /pets` — return pets with optional search and filter support:
  - `search` (pet name or breed)
  - `species`
  - `age`
  - `size`
  - `email`
- `GET /featured-pets` — fetch a short list of featured pets

### Authenticated Endpoints

These require a valid Bearer token in the `Authorization` header.

- `POST /pets` — create a new pet listing
- `GET /pets/:id` — fetch a single pet by ID
- `GET /listings` — get pet listings for a specific owner email
- `PATCH /pets/:id` — update a pet listing
- `DELETE /pets/:petId` — remove a pet listing
- `POST /adoption-requests` — submit an adoption request
- `GET /requests` — query requests by user email or pet ID
- `PATCH /requests/:id` — update request status (`approved`, `rejected`, `pending`)
- `DELETE /requests/:id` — delete an adoption request

## 💡 Notes

- Token validation is performed through `jose-cjs` using `${CLIENT_URL}/api/auth/jwks`.
- The server expects a MongoDB database named `pawly` with `pets` and `requests` collections.
- Built against Express v5 with JSON body parsing enabled.

## 📄 License

This repository is ready for customization and deployment for Pawly's backend service.
