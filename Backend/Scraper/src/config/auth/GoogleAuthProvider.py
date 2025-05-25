import json
import logging

#from fastapi import requests
import requests

from package_auth.OIDC_AccessToken import OIDC_AccessToken
from config.auth.OIDC_Google_UserInfo import OIDC_Google_UserInfo, OIDC_UserInfo
from config.config import app_settings

logger = logging.getLogger('MainLogger')

class GoogleAuthProvider:

    def get_access_token(self, authorization_code):
        post_data = {
            'code': authorization_code,
            'client_id': app_settings["auth_provider_google_client_id"],
            'client_secret': app_settings["auth_provider_google_client_secret"],
            'redirect_uri': app_settings["auth_provider_google_redirect_uri"],
            'grant_type': 'authorization_code',
            'access_type': 'offline'
        }

        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        logger.info("getting Google access_token")
        logger.info("sending post to: https://oauth2.googleapis.com/token")
        logger.info("request body: " + self.serialize(post_data))

        response = requests.post("https://oauth2.googleapis.com/token", data=post_data, headers=headers)
        response_data = response.json()

        logger.info("response: " + self.serialize(response_data))

        token = OIDC_AccessToken.create_access_token(
            response_data['access_token'],
            response_data['id_token'],
            response_data.get('refresh_token'),
            response_data['expires_in']
        )

        return token

    def get_user_info(self, access_token:OIDC_AccessToken):
        headers = {
            'Authorization': f'Bearer {access_token.get_access_token()}'
        }

        logger.info("getting google user info")
        logger.info("Bearer " + access_token.get_access_token())

        response = requests.get("https://www.googleapis.com/oauth2/v2/userinfo", headers=headers)
        user_info = response.json()
        # {'id': '107497450575977777777', 'email': 'massimo.rossi@gmail.com', 'verified_email': True,
        # 'name': 'massimo rossi', 'given_name': 'massimo', 'family_name': 'rossi',
        # 'picture': 'https://lh3.googleusercontent.com/a/ACg8ocJabcbsbdbd-WsZI4lAwAasdadsadas2b21sbPfab1AQhNYMOI=s96-c'}
        logger.info(user_info)

        return OIDC_UserInfo(refresh_token="",
                             name=user_info['name'],
                             email=user_info['email'],
                             given_name=user_info['given_name'],
                             family_name=user_info['family_name'],
                             picture=user_info['picture'])

    def refresh_token(self, google_access_token:OIDC_AccessToken):
        raise NotImplementedError("Unimplemented method 'refresh_token'")

    def serialize(self, obj):
        try:
            return json.dumps(obj)
        except (TypeError, ValueError) as e:
            logger.error(e)
            return None

