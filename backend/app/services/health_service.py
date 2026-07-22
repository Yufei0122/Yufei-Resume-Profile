from app.core.config import settings
from app.db.session import check_database_connection
from app.schemas.health import HealthResponse


def get_health_snapshot() -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        version=settings.app_version,
        database=check_database_connection(),
    )

