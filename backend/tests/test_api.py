import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_health_check(client: AsyncClient):
    response = await client.get("/api/health/")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Backend is running!"}

@pytest.mark.asyncio
async def test_register_and_login(client: AsyncClient):
    user_data = {"email": "test@example.com", "password": "password123"}
    
    # Register
    response = await client.post("/api/auth/register", json=user_data)
    assert response.status_code == 201
    assert response.json()["email"] == user_data["email"]
    
    # Login
    login_data = {"email": "test@example.com", "password": "password123"}
    response = await client.post("/api/auth/login", json=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()
    return response.json()["access_token"]

@pytest.mark.asyncio
async def test_history_endpoints(client: AsyncClient):
    user_data = {"email": "history_test@example.com", "password": "password123"}
    await client.post("/api/auth/register", json=user_data)
    response = await client.post("/api/auth/login", json=user_data)
    token = response.json()["access_token"]
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create history
    history_data = {"text": "HELLO WORLD"}
    response = await client.post("/api/history/", json=history_data, headers=headers)
    assert response.status_code == 200
    assert response.json()["text"] == "HELLO WORLD"
    
    # Get history
    response = await client.get("/api/history/", headers=headers)
    assert response.status_code == 200
    assert len(response.json()) >= 1
    assert response.json()[0]["text"] == "HELLO WORLD"
