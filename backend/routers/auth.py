from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from schemas.auth import LoginRequest, TokenResponse
from utils.jwt_utils import create_access_token, decode_access_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin"

security = HTTPBearer(auto_error=False)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest):
    if data.username != ADMIN_USERNAME or data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Неверные учётные данные")
    
    token = create_access_token({"sub": data.username, "role": "admin"})
    return TokenResponse(access_token=token)


async def get_current_admin(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
) -> str:
    if not credentials:
        raise HTTPException(status_code=401, detail="Токен не предоставлен")
    
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if not payload or payload.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Доступ запрещён")
    
    return payload.get("sub")
