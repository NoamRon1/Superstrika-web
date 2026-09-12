# Fund Ledger

Self-hosted investor transparency dashboard and team ledger.

## Start it

1. Copy `.env.example` to `.env` and replace `AUTH_SECRET`, database password, and initial admin password.
2. Create a host directory for uploads, then set `UPLOAD_PATH` to its absolute host path.
3. Run `docker compose up --build` and open `http://localhost:3000`.
4. Sign in using `INITIAL_ADMIN_EMAIL` and `INITIAL_ADMIN_PASSWORD`, then create editor accounts and configure the funding URL.

The first container startup creates the PostgreSQL schema and the configured initial admin if it does not already exist.

## Backups

Back up both the `postgres_data` Docker volume (or `pg_dump`) and the directory referenced by `UPLOAD_PATH`. Restoring only one will leave ledger records and receipt files out of sync.

## Security and operations

The investor dashboard and its attachments are deliberately public. Place the service behind HTTPS and use a long random `AUTH_SECRET`. The no-key FX provider is called only when a transaction is saved; the resulting rate, source, and capture time are stored in the ledger and are never recalculated.
