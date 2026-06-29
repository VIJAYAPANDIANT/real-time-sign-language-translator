# Real-Time Sign Language Translator Backend

This is the FastAPI backend for the ASL Translator.

## Database Management

We use SQLAlchemy as the ORM and Alembic for database migrations.

### ER Diagram

```mermaid
erDiagram
    users {
        int id PK
        string email
        string hashed_password
        string display_name
        datetime created_at
        datetime deleted_at
    }
    
    translation_sessions {
        int id PK
        int user_id FK
        datetime started_at
        datetime ended_at
        text full_transcript
        boolean audio_played
        string device_info
        datetime deleted_at
    }

    translation_events {
        int id PK
        int session_id FK
        int sequence_index
        string predicted_text
        string gloss
        float confidence
        datetime created_at
    }

    feedbacks {
        int id PK
        int user_id FK "nullable"
        int session_id FK "nullable"
        string predicted_label
        string corrected_label
        text notes
        datetime created_at
    }

    users ||--o{ translation_sessions : "has"
    users ||--o{ feedbacks : "submits"
    translation_sessions ||--o{ translation_events : "contains"
    translation_sessions ||--o{ feedbacks : "receives"
```

### Running Migrations Locally

By default, the backend is configured to use a local SQLite database (`test.db`) for easy development if a PostgreSQL `DATABASE_URL` is not provided. 

To apply the latest database schema (whether using SQLite or PostgreSQL):
```bash
# Activate your virtual environment
.\venv\Scripts\Activate.ps1

# Run Alembic migrations
alembic upgrade head
```

### Generating New Migrations
When you change the SQLAlchemy models in `app/models/`, generate a new migration script:
```bash
alembic revision --autogenerate -m "Description of your changes"
alembic upgrade head
```

### Seeding the Database
To populate the database with a dummy user (`demo@example.com` / `password`) and sample translation sessions:
```bash
python seed.py
```
