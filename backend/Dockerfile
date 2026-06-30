FROM python:3.11-slim

WORKDIR /app

# Install system dependencies required for OpenCV, MediaPipe, and PostgreSQL
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run uvicorn with worker class configured for WebSockets
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
