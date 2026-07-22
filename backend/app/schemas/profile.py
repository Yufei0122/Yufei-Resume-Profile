from pydantic import BaseModel


class StackResponse(BaseModel):
    frontend: str
    backend: str
    database: str


class ProfileResponse(BaseModel):
    name: str
    headline: str
    stack: StackResponse

