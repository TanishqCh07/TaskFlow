## Running Locally

1. Clone the repo
git clone <your-repo>
cd taskflow

2. Start services
docker compose up --build

3. Run migrations
docker exec -it taskflow_db psql -U postgres -d taskflow
\i backend/schema.sql
\i backend/seed.sql
\q

4. Open app
Frontend: http://localhost:5173
Backend: http://localhost:8080

## Test Credentials

Email: test@example.com
Password: password123