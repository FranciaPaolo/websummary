import logging
from fastapi import APIRouter, Depends

from package_auth.jwtTokenObj import JwtTokenObj
from package_auth.requires_roles import requires_role

from api import config

logger = logging.getLogger('MainLogger')
router = APIRouter()

@router.get("/user/", )
async def user(user: JwtTokenObj = Depends(requires_role(["customer"], config.app_settings))):
    # TODO store the jwt in a database for validation
    logger.debug("GET /user/")
    return {f"message": "Hello, User {user.get_fullname()}!"}

@router.get("/hello/", )
async def user():
    # api accessible to all
    logger.debug("GET /hello/")
    return {"message": "Hello, World!"}