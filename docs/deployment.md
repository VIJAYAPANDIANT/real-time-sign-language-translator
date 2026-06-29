# Deployment Guide

This document outlines the production concerns and architecture required for deploying the Real-Time Sign Language Translator.

## Infrastructure Requirements

### HTTPS and Secure WebSockets (WSS)
Browsers **require** a secure context (`HTTPS`) to access the `navigator.mediaDevices.getUserMedia()` API for the webcam. Therefore, your frontend must be served over HTTPS. 
Because the frontend connects to the backend WebSocket securely, the backend must also be served over HTTPS/WSS.
- **Self-Hosting**: If you deploy on a VPS, use a reverse proxy like **Nginx** or **Caddy** to handle SSL termination. Configure the proxy to upgrade WebSocket connections (`Connection: Upgrade`).
- **PaaS (Render/Railway)**: These platforms automatically terminate SSL and handle WebSocket upgrading for you.

### Horizontal Scaling & WebSockets
WebSockets are stateful. If you scale the backend beyond a single instance (e.g. `replicas: 3`), a client's HTTP requests and WebSocket frames might hit different servers.
- **Sticky Sessions**: Configure your load balancer (e.g., AWS ALB, Nginx) to route traffic from the same user to the same instance.
- **Redis Connection Registry (Optional)**: If users need to interact with each other across different backend instances (not currently required for a personal translator, but good for future-proofing), you must implement a Redis Pub/Sub adapter to broadcast messages across the cluster. We have included `redis` in the local `docker-compose.yml` to prepare for this.

## Inference Hardware: CPU vs GPU

By default, the backend Dockerfile uses `python:3.11-slim` and executes the ONNX models using the standard CPU execution provider (`onnxruntime`).
- **CPU Inference**: Sufficient for standard ~10-15 FPS landmark classification on small sequence lengths. Keeps hosting costs low (e.g. $7/mo on Render).
- **GPU Inference**: If you want to run complex 3D CNNs or Transformer models directly on video frames instead of landmarks, you will need GPU acceleration. 
  - To switch to GPU: Change the backend Dockerfile base image to an `nvidia/cuda` image. 
  - Install `onnxruntime-gpu` instead of `onnxruntime` in `requirements.txt`.
  - Update `inference_service.py` to target the `CUDAExecutionProvider`.

## Environment Variables and Secrets

**Never commit `.env` files to source control.**

### Required Production Secrets
Ensure the following variables are injected into your production environment (via GitHub Secrets, Vercel Environment Variables, or Render settings):
- `DATABASE_URL`: Connection string to your production PostgreSQL instance.
- `JWT_SECRET`: A long, cryptographically secure random string.
- `CORS_ORIGINS`: A JSON array string of allowed frontend domains (e.g., `["https://my-translator-app.vercel.app"]`).

## CI/CD Pipeline

The project utilizes **GitHub Actions**:
1. **CI Pipeline (`.github/workflows/ci.yml`)**: Runs on PRs to `main`. It lints the code (eslint/ruff), runs tests (pytest), and performs dummy builds of the Dockerfiles to ensure no syntax/dependency errors are merged.
2. **CD Pipeline (`.github/workflows/deploy.yml`)**: Runs on merges to `main`.
   - **Backend**: Builds and pushes the Docker image to GitHub Container Registry (GHCR). Triggers a Render deploy hook (or SSH script).
   - **Database**: The deployment script must trigger Alembic migrations (e.g., `alembic upgrade head`) before rolling over traffic to the new instances.
   - **Frontend**: Automatically builds and deploys the React app using the Vercel CLI.

## Monitoring and Logging

- **Error Tracking**: It is highly recommended to integrate **Sentry** into both the React frontend and FastAPI backend. It captures unhandled exceptions and provides deep stack traces.
- **Structured Logging**: FastAPI logs should be structured as JSON for easy querying in log aggregators (e.g., Datadog, AWS CloudWatch, or ELK stack). Use the Python `logging` module to output JSON logs.
