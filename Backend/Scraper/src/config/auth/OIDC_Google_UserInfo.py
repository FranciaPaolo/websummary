
class OIDC_UserInfo:
    def __init__(self, refresh_token:str=None, name:str=None, email:str=None, given_name:str=None, family_name:str=None, picture:str=None):
        self.refresh_token = refresh_token
        self.name = name # Massimo Rossi
        self.email = email
        self.given_name = given_name # Massimo
        self.family_name = family_name # Rossi
        self.picture = picture # https://lh3.googleusercontent.com/a/adasdsadsdd-asdsadsadas=s96-c

    @classmethod
    def from_google_user_info(cls, google_user_info:"OIDC_Google_UserInfo"):
        return cls(
            refresh_token=google_user_info.refresh_token,
            name=google_user_info.name,
            email=google_user_info.email,
            given_name=google_user_info.given_name,
            family_name=google_user_info.family_name,
            picture=google_user_info.picture
        )


class OIDC_Google_UserInfo:
    def __init__(self, refresh_token:str=None, name:str=None, email:str=None, given_name:str=None, family_name:str=None, picture:str=None):
        self.refresh_token = refresh_token
        self.name = name
        self.email = email
        self.given_name = given_name
        self.family_name = family_name
        self.picture = picture

    def to_oidc_user_info(self):
        return OIDC_UserInfo.from_google_user_info(self)
