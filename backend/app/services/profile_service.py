from app.schemas.profile import ProfileResponse, StackResponse


def get_profile_snapshot() -> ProfileResponse:
    return ProfileResponse(
        name="Yufei",
        headline="Full-stack developer profile",
        stack=StackResponse(
            frontend="Node.js + JavaScript",
            backend="Python + FastAPI",
            database="MySQL",
        ),
    )

