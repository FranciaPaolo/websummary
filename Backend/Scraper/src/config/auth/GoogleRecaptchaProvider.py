import json
import logging
import requests
from config.config import app_settings

logger = logging.getLogger('MainLogger')

class GoogleRecaptchaProvider:

    def isCaptchaValid(self, recaptcha_token:str):
        verification_url = "https://www.google.com/recaptcha/api/siteverify"
        payload = {
            "secret": app_settings["recaptcha_secret_key"],
            "response": recaptcha_token
        }
        response = requests.post(verification_url, data=payload)

        response_data = response.json()
        #logger.info(response_data)
        if not response_data.get("success"):
            return False
        return True