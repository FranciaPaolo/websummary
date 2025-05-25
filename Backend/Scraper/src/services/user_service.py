import logging
from config.auth.OIDC_Google_UserInfo import OIDC_UserInfo
from model.usermember import UserMember
from repository.user_repository import DbRepositoryUser
from repository.dbengine import DbEngine

logger = logging.getLogger('MainLogger')

class UserService:

    _dbRepo_users:DbRepositoryUser

    def __init__(self):
        self._dbRepo_users=DbRepositoryUser(DbEngine())


    def create_or_update_user_by_email(self, email: str, name:str):
        user = self._dbRepo_users.find_by_email(email)
        if user is None:
            user = UserMember.create_user_from_oidc_user_info(
                refresh_token="",
                name=name,
                email=email,
                picture="")
            user.setRole("customer")  # Default role for new users

        user.setLastLoginDate()
        self._dbRepo_users.add_or_update_user(user)
        return user

    def update_user_from_oidc(self, user: UserMember, user_info: OIDC_UserInfo, jwtToken:str):
        user.setFullName(user_info.name)
        user.setPicture(user_info.picture)
        user.setLastLoginDate()
        user.setLastToken(jwtToken)

        self._dbRepo_users.add_or_update_user(user)
        return user

    def find_user_by_email(self, email:str, name:str, raise_error_if_not_found:bool=False) -> UserMember:
        user=self._dbRepo_users.find_by_email(email)
        if raise_error_if_not_found and user is None:
            raise ValueError("User not found",{"email":email, "fullname":name})
        return user


    def update_last_jwt(self, user: UserMember, jwt: str):
        #user = self._dbRepo_users.find_by_email(email)
        if user is not None:
            user.setLastLoginDate()
            user.setLastToken(jwt)
            self._dbRepo_users.add_or_update_user(user)
