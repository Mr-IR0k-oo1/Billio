# Billio - Advanced Invoicing Microservices Stack

Billio is a modern invoicing platform built with a high-performance Rust backend and a stunning, premium React frontend.

## 🏗️ Architecture

- **Frontend**: React + Vite + TypeScript + Framer Motion (Glassmorphic UI).
- **Backend (Rust)**:
  - `auth-service`: Authentication using Argon2 and JWT.
  - `client-service`: Customer management.
  - `product-service`: Catalog management.
  - `invoice-service`: Core engine for Invoices, Estimates, Recurring Invoices, and Reports.
- **Gateway**: Nginx reverse proxy.
- **Database**: PostgreSQL 15.

## 🚀 Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local frontend development)
- Rust (for local backend development)

### Quick Start (Full Stack)

Clone the repository and run:

```bash
docker compose up --build
```

The application will be available at:

- **Frontend**: <http://localhost:5173> (if run locally via `npm run dev`) or service port.
- **API Gateway**: <http://localhost:5000/api>

### Local Development

1. **Database**: `docker compose up -d postgres`
2. **Backend**:

   ```bash
   cd backend
   cargo run -p auth-service
   cargo run -p invoice-service
   # ...etc
   ```

3. **Frontend**:

   ```bash
   npm install
   npm run dev
   ```

## 🛠️ Project Structure

```text
.
├── backend/            # Rust microservices workspace
│   ├── auth-service/
│   ├── client-service/
│   ├── product-service/
│   ├── invoice-service/
│   └── common/         # Shared Rust logic & middleware
├── src/                # React frontend source
├── .github/workflows/  # CI/CD Pipelines
├── docker-compose.yml  # Orchestration
├── nginx.conf          # Gateway configuration
└── Makefile            # Shortcut commands
```

## 🧪 Testing

Run the complete test suite:

```bash
make test
```

## 📄 License

MIT
