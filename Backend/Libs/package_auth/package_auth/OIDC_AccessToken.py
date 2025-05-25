
class OIDC_AccessToken:
    def __init__(self, access_token:str, id_token:str, refresh_token:str, expires_in:int):
        self.access_token = access_token
        self.id_token = id_token
        self.refresh_token = refresh_token
        self.expires_in = expires_in

    @staticmethod
    def create_access_token(access_token, id_token, refresh_token, expires_in):
        return OIDC_AccessToken(access_token, id_token, refresh_token, expires_in)

    def get_access_token(self):
        return self.access_token

    def get_id_token(self):
        return self.id_token

    def get_refresh_token(self):
        return self.refresh_token

    def get_expires_in(self):
        return self.expires_in
