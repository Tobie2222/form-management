# Form Management API

A RESTful API for managing dynamic forms, fields, and submissions — built with **NestJS**, **TypeORM**, and **MySQL**.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | NestJS 11 |
| ORM | TypeORM 0.3 |
| Database | MySQL 8.0 |
| Validation | class-validator |
| Documentation | Swagger / OpenAPI |
| Migration | db-migrate |
| Linting | ESLint + Prettier + Husky |

## Prerequisites

- Node.js >= 18
- npm >= 9
- Docker & Docker Compose

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Then edit `.env` and fill in your values:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_DATABASE=form_management
PORT=3000
```

### 3. Start the database

```bash
docker compose up -d
```

> Spins up a MySQL 8.0 container. Wait for the health check to pass before proceeding (up to ~60s on first run).

### 4. Run database migrations

```bash
./node_modules/.bin/db-migrate up
```

### 5. Start the server

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run start:prod
```

API is available at `http://localhost:3000`
Swagger UI is available at `http://localhost:3000/api`

## API Reference

### Forms

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/forms` | List all forms (paginated) |
| `POST` | `/forms` | Create a new form |
| `GET` | `/forms/active` | List all active forms |
| `GET` | `/forms/:id` | Get a form by ID |
| `PUT` | `/forms/:id` | Update a form |
| `DELETE` | `/forms/:id` | Soft delete a form |

**Pagination query params:** `?page=1&limit=10`

### Fields

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/forms/:id/fields` | Add a field to a form |
| `PUT` | `/forms/:id/fields/:fid` | Update a field |
| `DELETE` | `/forms/:id/fields/:fid` | Soft delete a field |

**Supported field types:** `text` · `number` · `date` · `color` · `select`

> Fields of type `select` require an `options` array.

### Submissions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/forms/:id/submit` | Submit a form |
| `GET` | `/submissions` | List all submissions |

> A form must be in `active` status before it can accept submissions.

**Submission payload format:**

```json
{
  "data": {
    "<field_id>": "<value>",
    "<field_id>": "<value>"
  }
}
```

Field IDs can be retrieved from `GET /forms/:id`.

## Data Models

### Form

| Field | Type | Description |
|---|---|---|
| `id` | number | Auto-incremented primary key |
| `title` | string | Form title (max 255 chars) |
| `description` | string \| null | Optional description |
| `status` | `draft` \| `active` | Form status |
| `order` | number | Display order |
| `createdAt` | datetime | Creation timestamp |
| `updatedAt` | datetime | Last update timestamp |
| `deletedAt` | datetime \| null | Soft delete timestamp |

### Field

| Field | Type | Description |
|---|---|---|
| `id` | number | Auto-incremented primary key |
| `formId` | number | Associated form ID |
| `label` | string | Field display label |
| `type` | enum | `text` · `number` · `date` · `color` · `select` |
| `order` | number | Display order |
| `required` | boolean | Whether the field is required |
| `options` | string[] \| null | Options for `select` type fields |

### Submission

| Field | Type | Description |
|---|---|---|
| `id` | number | Auto-incremented primary key |
| `formId` | number | Submitted form ID |
| `data` | JSON | Key-value pairs keyed by field ID |
| `submittedAt` | datetime | Submission timestamp |

## Field Validation Rules

| Type | Rules |
|---|---|
| `text` | Must be a string, max 200 characters |
| `number` | Must be a number between 0 and 100 |
| `date` | Must be a valid date string, cannot be a past date |
| `color` | Must be a valid hex color (e.g. `#fff` or `#3498db`) |
| `select` | Must match one of the predefined options |

## Development Scripts

```bash
npm run start:dev     # Start in watch mode
npm run build         # Compile TypeScript
npm run lint          # Run ESLint with auto-fix
npm run format        # Run Prettier
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:cov      # Run tests with coverage report
```

## Project Structure

```
src/
├── common/
│   ├── dto/            # Shared DTOs (pagination)
│   ├── filters/        # Global exception filters
│   └── validators/     # Field value validators
├── entities/           # TypeORM entities
├── enums/              # Shared enums (FieldType, FormStatus)
└── modules/
    ├── fields/         # Fields CRUD module
    ├── forms/          # Forms CRUD module
    └── submissions/    # Submissions module
```

## License

UNLICENSED — private repository.
