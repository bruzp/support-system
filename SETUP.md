# Support System — Dev Setup Guide

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) with Docker Compose v2
- Git

---

## 1. Clone the repository

```bash
git clone <your-repo-url> support-system
cd support-system
```

---

## 2. Fix Docker credential config (Linux/WSL users)

If you're on Linux or WSL and get an `exec format error` when building, run:

```bash
echo "{}" > ~/.docker/config.json
```

---

## 3. Set up the API environment file

```bash
cp support-api/.env.example support-api/.env
```

Open `support-api/.env` and update the database values to match Docker:

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
cp support-frontend/.env.example support-frontend/.env.local
```

Make sure this is set:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

---

## 5. Build the Docker images

```bash
docker compose build
```

---

## 6. Regenerate the frontend lockfile

> This step ensures `yarn.lock` is compatible with the Linux Alpine container.
> Only needed on first setup or after adding new packages.

```bash
docker compose run --rm frontend yarn install
```

---

## 7. Start all services

```bash
docker compose up -d
```

Verify all containers are running:

```bash
docker compose ps
```

You should see these running:

| Container            | Status  |
|----------------------|---------|
| support_app          | running |
| support_frontend     | running |
| support_postgres     | running |
| support_ollama       | running |

---

## 8. Generate the Laravel app key

```bash
docker compose exec app php artisan key:generate
```

---

## 9. Run database migrations

```bash
docker compose exec app php artisan migrate
```

---

## 10. Seed the database (optional)

```bash
docker compose exec app php artisan db:seed
```

---

## 11. Pull the Ollama model (if not auto-pulled)

The `ollama-pull` service handles this automatically on first run.
If it didn't work, pull manually:

```bash
docker compose exec ollama ollama pull qwen2.5:0.5b
```

---

## ✅ Done — Services are running at:

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000       |
| API       | http://localhost:8000       |
| Postgres  | localhost:5432              |
| Ollama    | http://localhost:11434      |

---

## Useful commands

```bash
# Stop all services
docker compose down

# View logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f app
docker compose logs -f frontend

# Bash into a container
docker compose exec app bash
docker compose exec frontend sh      # alpine uses sh
docker compose exec postgres psql -U supportuser -d supportdb

# Run artisan commands
docker compose exec app php artisan <command>

# Rebuild a single service after Dockerfile changes
docker compose build --no-cache frontend
docker compose up -d frontend
```

---

## Troubleshooting

**`yarn install` fails with lockfile error**
```bash
rm support-frontend/yarn.lock
docker compose run --rm frontend yarn install
docker compose up -d frontend
```

**Migrations fail (cannot connect to DB)**
> Postgres may still be starting up. Wait a few seconds and retry.
```bash
docker compose exec app php artisan migrate
```

**Frontend not reflecting code changes**
> The volume mount should handle hot reload. If it's stuck, restart the container:
```bash
docker compose restart frontend
```