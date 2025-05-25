
from package_auth.OIDC_AccessToken import OIDC_AccessToken
from package_auth.jwtTokenObj import JwtTokenObj

class JwtEncoder:

    def __init__(self, secret_key: str = "", duration_hours: int = 0, renew_minutes_before_expiration: int = 0):
        self._secret_key = secret_key
        self._duration_hours = duration_hours
        self._renew_minutes_before_expiration = renew_minutes_before_expiration

    def get_secret_key(self):
        # if not self._secret_key:
        #     self._secret_key = config.app_settings["auth_jwt_key"]
        return self._secret_key

    def get_duration_hours(self):
        # if self._duration_hours == 0:
        #     self._duration_hours = config.app_settings["auth_jwt_durationHours"]
        return self._duration_hours

    def get_renew_minutes_before_expiration(self):
        # if self._renew_minutes_before_expiration == 0:
        #     self._renew_minutes_before_expiration = config.app_settings["auth_jwt_renewMinutesBeforeExpiration"]
        return self._renew_minutes_before_expiration

    def generate_string(self, username:str, fullname:str, role:str, id_user:int, provider:str, oidc_access_token:OIDC_AccessToken):
        tokenObj:JwtTokenObj=JwtTokenObj(
            secret_key=self.get_secret_key(),
            duration_hours=self.get_duration_hours(),
            renew_minutes_before_expiration=self.get_renew_minutes_before_expiration(),
            token=""
        )
        return tokenObj.generate_token_with_oidc(username=username, id_user=id_user, fullname=fullname, role=role, provider=provider, oidc_access_token=oidc_access_token)

    def from_string(self, token:str) -> JwtTokenObj:
        tokenObj:JwtTokenObj=JwtTokenObj(
            secret_key=self.get_secret_key(),
            duration_hours=self.get_duration_hours(),
            renew_minutes_before_expiration=self.get_renew_minutes_before_expiration(),
            token=token)
        return tokenObj

    # header will be in the form of "Bearer xuvngjaasd"
    # where "xuvngjaasd" is the token
    def from_header(self, authorization:str) -> JwtTokenObj:
        token= authorization[7:]
        # TODO check if Jwt is expired
        return self.from_string(token)
