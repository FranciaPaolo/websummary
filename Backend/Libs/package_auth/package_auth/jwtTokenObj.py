import jwt
import datetime

from package_auth.OIDC_AccessToken import OIDC_AccessToken

class JwtTokenObj:
    def __init__(self, secret_key: str, duration_hours: int, renew_minutes_before_expiration: int, token: str):
        self._secret_key = secret_key
        self._duration_hours = duration_hours
        self._renew_minutes_before_expiration = renew_minutes_before_expiration
        self._token = token
        self.claims = None

    def generate_token(self, username: str, id_user: int, provider: str, access_token: str, refresh_token: str, id_token: str, expires_in: int, fullname:str, role:str) -> str:
        claims = {
            "provider": provider,
            "accessToken": access_token,
            "refreshToken": refresh_token,
            "idToken": id_token,
            "idUser": id_user,
            "expiresIn": expires_in,
            "role": role,
            "fullname": fullname
        }
        return self.create_token(claims, username)

    def generate_token_with_oidc(self, username: str, fullname:str, role:str, id_user: int, provider: str, oidc_access_token: OIDC_AccessToken) -> str:
        return self.generate_token(
            username=username,
            id_user=id_user,
            provider=provider,
            access_token=oidc_access_token.get_access_token(),
            refresh_token=oidc_access_token.get_refresh_token(),
            id_token=oidc_access_token.get_id_token(),
            expires_in=oidc_access_token.get_expires_in(),
            fullname=fullname,
            role=role
        )

    def create_token(self, claims: dict, subject: str) -> str:
        expiration = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=self._duration_hours)
        claims.update({"sub": subject, "iat": datetime.datetime.now(datetime.timezone.utc), "exp": expiration})
        return jwt.encode(claims, self._secret_key, algorithm="HS256")

    def validate_token(self, username: str) -> bool:
        extracted_username = self.get_username()
        return extracted_username == username and not self.is_token_expired()

    def get_username(self) -> str:
        return self.extract_all_claims().get("sub")

    def get_role(self) -> str:
        return self.extract_all_claims().get("role")

    def get_fullname(self) -> str:
        return self.extract_all_claims().get("fullname")

    def extract_all_claims(self) -> dict:
        if self.claims is None:
            self.claims = jwt.decode(self._token, self._secret_key, algorithms=["HS256"])
        return self.claims

    def get_expiration(self) -> datetime.datetime:
        return datetime.datetime.fromtimestamp(self.extract_all_claims().get("exp"),datetime.timezone.utc)

    def is_token_expired(self) -> bool:
        return self.get_expiration() < datetime.datetime.now(datetime.timezone.utc)

    def is_token_expiring_soon(self) -> bool:
        now = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(minutes=self._renew_minutes_before_expiration)
        return self.get_expiration() < now

    def get_provider(self) -> str:
        return self.extract_all_claims().get("provider")

    def get_access_token(self) -> str:
        return self.extract_all_claims().get("accessToken")

    def get_id_user(self) -> int:
        return int(self.extract_all_claims().get("idUser"))

    def get_refresh_token(self) -> str:
        return self.extract_all_claims().get("refreshToken")

    def get_id_token(self) -> str:
        return self.extract_all_claims().get("idToken")

    def get_expires_in(self) -> int:
        return self.extract_all_claims().get("expiresIn")

    def get_oidc_access_token(self) -> 'OIDC_AccessToken':
        return OIDC_AccessToken(
            self.get_access_token(),
            self.get_id_token(),
            self.get_refresh_token(),
            self.get_expires_in()
        )
