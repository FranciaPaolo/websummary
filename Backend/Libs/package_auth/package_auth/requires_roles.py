import logging
from typing import List
from fastapi import Depends, HTTPException, Header

from package_auth.jwtEncoder import JwtEncoder
from package_auth.jwtTokenObj import JwtTokenObj

logger = logging.getLogger('MainLogger')

def get_current_user_dependency(config: dict):
    def dependency(authorization: str = Header(...)) -> JwtTokenObj:
        return get_current_user(config=config, authorization=authorization)
    return dependency

# get user from jwt
def get_current_user(config:dict, authorization: str) -> JwtTokenObj:
    # Extract the Bearer token from the Authorization header
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authentication scheme")

    jwtObj:JwtTokenObj=None
    is_expired=False

    try:
        jwtObj:JwtTokenObj=JwtEncoder(config["auth_jwt_key"],config["auth_jwt_durationHours"], config["auth_jwt_renewMinutesBeforeExpiration"])\
            .from_header(authorization)
        is_expired=jwtObj.is_token_expired()
    except Exception as e:
        logger.error(f"Error decoding JWT: {e}")
        raise HTTPException(status_code=401, detail="Invalid token")

    if is_expired or jwtObj is None:
        raise HTTPException(status_code=401, detail="Token has expired")

    # TODO missing database validation of the user
    return jwtObj


def requires_role(roles: List[str], config_dict: dict) -> JwtTokenObj:
    """
    Dependency function to enforce role-based access control.
    Args:
        roles (List[str]): A list of roles that are allowed to access the resource.
                           The user's role must match one of these roles.
        config_dict (dict): A configuration dictionary that should contains: auth_jwt_key, auth_jwt_durationHours, auth_jwt_renewMinutesBeforeExpiration
    Returns:
        Callable[[JwtTokenObj], JwtTokenObj]: A dependency function that validates the user's role
                                              and raises an HTTPException if access is denied.
    Raises:
        HTTPException: If the user's role is not in the allowed roles, a 403 Forbidden error is raised.
    """

    def role_dependency(user: JwtTokenObj = Depends(get_current_user_dependency(config_dict))):
        if user.get_role() not in roles:
            raise HTTPException(status_code=403, detail="You don't have access to this resource")
        return user
    return role_dependency