import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    app_name = os.getenv("APP_NAME", "Yufei Resume API")
    app_version = os.getenv("APP_VERSION", "1.0.0")
    app_host = os.getenv("APP_HOST", "0.0.0.0")
    app_port = int(os.getenv("APP_PORT", "8000"))
    cors_origins = [origin.strip() for origin in os.getenv(
        "CORS_ORIGINS", "http://localhost:5173"
    ).split(",") if origin.strip()]
    database_url = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://yufei_user:change_me@localhost:3306/yufei_resume",
    )


settings = Settings()

