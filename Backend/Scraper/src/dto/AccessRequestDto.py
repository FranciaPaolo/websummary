from pydantic import BaseModel

class RequestAccess(BaseModel):
    email: str
    fullname: str
    captchatoken: str