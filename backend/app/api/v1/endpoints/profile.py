from fastapi import APIRouter

from app.schemas.profile import ProfileResponse
from app.services.profile_service import get_profile_snapshot

router = APIRouter()


@router.get("/profile", response_model=ProfileResponse)
def profile() -> ProfileResponse:
    return get_profile_snapshot()

