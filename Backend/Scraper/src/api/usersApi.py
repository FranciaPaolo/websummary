import logging
from fastapi import APIRouter, Depends
from package_auth.requires_roles import requires_role
from config.auth.GoogleRecaptchaProvider import GoogleRecaptchaProvider
from package_auth.jwtTokenObj import JwtTokenObj
from dto.AccessRequestDto import RequestAccess
from services.user_service import UserService
from services.service_singleton import get_google_recaptcha_provider, get_user_service
from config.config import app_settings

router = APIRouter()
logger = logging.getLogger('MainLogger')

@router.get("/users/user/", )
async def user(user: JwtTokenObj = Depends(requires_role(["customer"], app_settings)), user_service: UserService = Depends(get_user_service)):
    # TODO store the jwt in a database for validation
    # logger.debug(authorization)
    id_user =  user.get_id_user()
    logger.debug(f"GET /users/user/ idUser:{id_user}")
    return user_service._dbRepo_users.find_by_id(id_user)

@router.post("/users/requestaccess/", )
async def requestaccess(request:RequestAccess, captcha_service: GoogleRecaptchaProvider = Depends(get_google_recaptcha_provider), user_service: UserService = Depends(get_user_service)):
    logger.debug(f"GET /auth/requestaccess/ email:{request.email} captchatoken:{request.captchatoken}")
    isvalid=captcha_service.isCaptchaValid(request.captchatoken)
    if isvalid:
        # TODO implement email notification
        # email:EmailSender=EmailSender()
        # email.send_email(
        #     receiver="info@websummarizer.com",
        #     subject=EmailTemplate_RequestAccess.get_subject(requestor_email=request.email),
        #     body=EmailTemplate_RequestAccess.get_body(requestor_email=request.email,requestor_fullname=request.fullname)
        # )
        user_service.create_or_update_user_by_email(
            email=request.email,
            name=request.fullname
        )

        return{}
    else:
        raise ValueError("Invalid request")