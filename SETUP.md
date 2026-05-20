# Support System — Dev Setup Guide

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2
- Git

---

## 1. Clone the repository

```bash
git clone https://github.com/bruzp/support-system.git support-system
cd support-system
```

---

## 2. Fix Docker credential config (Linux/WSL users) (Optional)

If you're on Linux or WSL and get an `exec format error` when building, run:

```bash
echo "{}" > ~/.docker/config.json
```

---

## 3. Set up the API environment file

```bash
cp support-api/.env.example support-api/.env
```

Open `support-api/.env` and update the database values to match Docker: (Optional)

```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=supportdb
DB_USERNAME=supportuser
DB_PASSWORD=supportpassword

OLLAMA_HOST=http://ollama:11434
```

---

## 4. Set up the Frontend environment file

```bash
touch support-frontend/.env
```

Make sure this is set:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 5. Build the Docker images

```bash
docker compose build --no-cache
```

---

## 6. Install dependencies

```bash
docker compose run --rm app composer install
```

---

## 7. Regenerate the frontend lockfile

> This step ensures `yarn.lock` is compatible with the Linux Alpine container.
> Only needed on first setup or after adding new packages.

```bash
docker compose run --rm frontend yarn install
```

---

## 8. Start all services

```bash
docker compose up -d
```

---

## 9. Generate the Laravel app key

```bash
docker compose exec app php artisan key:generate
```

---

## 10. Run database migrations and seeder

```bash
docker compose exec app php artisan migrate --seed
```

---

## 11. Access the application

Frontend:

```text
http://localhost:3000/auth/login
```

API:

```text
http://localhost:8000/api
```

---

## 12. Sample users

The seeder creates the following users:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | password |
| Regular User | `user@example.com` | password |
