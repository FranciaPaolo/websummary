import logging
from fastapi import APIRouter, Depends

from config.auth.GoogleAuthProvider import GoogleAuthProvider
from config.auth.OIDC_Google_UserInfo import OIDC_UserInfo
from dto.AuthRequestDto import AuthRequestDto
from services.user_service import UserService
from package_auth.requires_roles import requires_role
from services.service_singleton import get_google_auth_provider, get_user_service
from package_auth.OIDC_AccessToken import OIDC_AccessToken
from package_auth.jwtEncoder import JwtEncoder
from package_auth.jwtTokenObj import JwtTokenObj

from config.config import app_settings
from model.usermember import UserMember

router = APIRouter()
logger = logging.getLogger('MainLogger')

@router.post("/auth/accesstoken/",)
async def access_tokenrefresh(authRequest:AuthRequestDto,
                              googleAuthProvider: GoogleAuthProvider = Depends(get_google_auth_provider),
                              userService: UserService = Depends(get_user_service)):

    logger.debug(f"POST /auth/accesstoken/")
    if (authRequest.provider_name == "google"):
        # get the access_token from the auth code of Google
        access_token:OIDC_AccessToken = googleAuthProvider.get_access_token(authRequest.provider_accessCode)

        # get the user info from Google
        userInfo:OIDC_UserInfo = googleAuthProvider.get_user_info(access_token)

        # in the demo only pre-validated users can join the website
        userMember:UserMember = userService.find_user_by_email(email=userInfo.email, name=userInfo.name)
        if userMember is None:
            raise ValueError("Invalid user or password", {"email": userInfo.email, "fullname": userInfo.name})

        # generate the jwt
        jwt:str = JwtEncoder(app_settings["auth_jwt_key"],
                             app_settings["auth_jwt_durationHours"],
                             app_settings["auth_jwt_renewMinutesBeforeExpiration"])\
            .generate_string(userInfo.email, userInfo.name, userMember.role, userMember.getIdUser(),"google",access_token)

        # update user in the database with the info from the provider
        userService.update_user_from_oidc(userMember, userInfo, jwt)
        return jwt
    else:
        raise ValueError("Invalid provider")

@router.get("/auth/refreshtoken/", )
async def refresh_token(token: str, user: JwtTokenObj = Depends(requires_role(["customer"], app_settings))):#q: str, authorization: str = Header(...)):
    logger.debug(f"GET /auth/refreshtoken/?token={token}")
    if not token:
        raise ValueError("Token is missing")

    id_user = user.get_id_user()
    username = user.get_username()
    fullname = user.get_fullname()
    role = user.get_role()
    provider = user.get_provider()
    oidc_access_token = user.get_oidc_access_token()

    # TODO: to double check the token we could ask the username parameter in the querystring
    if user.is_token_expiring_soon():
        google_new_access_token = None
        if provider == "google":
            google_auth_provider=GoogleAuthProvider()
            google_new_access_token = google_auth_provider.refresh_token(oidc_access_token)

        return JwtEncoder().generate_string(username, fullname, role, id_user, provider, google_new_access_token)
    else:
        return token


