from services.summarizer_service import SummarizerService
from services.user_service import UserService
from config.auth.GoogleAuthProvider import GoogleAuthProvider
from config.auth.GoogleRecaptchaProvider import GoogleRecaptchaProvider
from repository.dbengine import DbEngine

# Initialize services singleton
summarizer_service = SummarizerService()

user_service_instance = UserService()

def get_user_service():
    return user_service_instance # Singleton

def get_google_auth_provider():
    return GoogleAuthProvider()

def get_google_recaptcha_provider():
    return GoogleRecaptchaProvider()