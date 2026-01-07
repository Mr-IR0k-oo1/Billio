# Billio - Invoicing Application Setup

## Status: ✅ Fully Working

The application is now completely functional with all components running.

## Running Services

### Currently Running:
- **Frontend**: http://localhost:5174 (Vite dev server)
- **API Server**: http://localhost:5000 (Node.js Express)
- **Database**: PostgreSQL (socket at ~/.local/var/run)

## Starting the Application

### 1. Start PostgreSQL
```bash
pg_ctl -D ~/.local/var/postgres -o "-k ~/.local/var/run" start
```

### 2. Start API Server
```bash
cd /home/irok/Projects/micro/server
node index.js
```

### 3. Start Frontend Dev Server
```bash
cd /home/irok/Projects/micro/micro
npm run dev
```

## Database

- **Database Name**: billio
- **Host**: localhost (socket at ~/.local/var/run)
- **User**: user
- **Password**: password

Schema is automatically loaded from `server/schema.sql` and includes:
- Users table with password hashing
- Clients, Products, Invoices, InvoiceItems
- Sample data (3 clients, 3 products)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Clients
- `GET /api/clients` - List all clients
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Invoices
- `GET /api/invoices` - List invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/:id/pdf` - Download invoice as PDF
- `POST /api/invoices/:id/send` - Send invoice via email

### AI Features
- `POST /api/ai/describe-line-items` - AI-powered line item generation

## Test Credentials

After first run, use:
- **Email**: demo@example.com
- **Password**: demo123

Or register a new account via the frontend.

## Building for Production

### Build Frontend
```bash
cd /home/irok/Projects/micro/micro
npm run build
```
Output: `dist/` directory with static files

### Build Docker Images
```bash
docker-compose up -d
```
This will build and start all services in containers.

## Environment Variables

Server configuration in `server/.env`:
- `PORT`: API server port (5000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: JWT signing secret
- `OPENAI_API_KEY`: Optional, for AI features
- `SMTP_*`: Optional, for email features

## Notes

- Frontend uses React + TypeScript with Vite bundler
- API uses Express.js with PostgreSQL
- Authentication via JWT tokens stored in localStorage
- All API endpoints require authentication (except /auth/*)
- PDF generation and email sending available (requires SMTP config)
- AI line item generation available (requires OpenAI API key)
