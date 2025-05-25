from pydantic import BaseModel


class AuthRequestDto(BaseModel):
    provider_name: str
    provider_accessCode: str

    # def __init__(self, provider_name: str, provider_accessCode: str):
    #     self.provider_name = provider_name
    #     self.provider_accessCode = provider_accessCode