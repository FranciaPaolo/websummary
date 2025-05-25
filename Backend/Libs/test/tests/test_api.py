from fastapi.testclient import TestClient
import sys
import os

from package_auth.OIDC_AccessToken import OIDC_AccessToken
from package_auth.jwtEncoder import JwtEncoder
from package_auth.jwtTokenObj import JwtTokenObj

#print(sys.path)
# Add the root folder to the Python path
#sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
#sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../api')))
#print(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.main import app  # adjust import to where your app is

auth_jwt_key="QsvUdnN3rx`GQF,'#'V;;3Ld>q^sHtk~9lMq*-1fUXI}\"g_Goz2ixAx*POQR{oD"
auth_jwt_durationHours=6
auth_jwt_renewMinutesBeforeExpiration=60

client = TestClient(app)

def test_hello():
    # Test the NON authenticated /hello endpoint
    # This test checks if the /hello endpoint returns a 200 status code
    response = client.get("/hello")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, World!"}

def test_user_no_auth():
    response = client.get("/user")
    assert response.status_code == 422

def test_user_invalid_token():
    response = client.get("/user", headers={"Authorization": "Bearer YOUR_BEARER_TOKEN"})
    assert response.status_code == 401

def test_user_valid_token():

    jwt:str = JwtEncoder(auth_jwt_key, auth_jwt_durationHours, auth_jwt_renewMinutesBeforeExpiration)\
        .generate_string("paolo.francia", "Paolo", "customer", 1,"google", OIDC_AccessToken("123","456","789",120))

    response = client.get("/user", headers={"Authorization": f"Bearer {jwt}"})
    assert response.status_code == 200

def test_user_expired_token():

    # expires_in = -10
    # -> expired token
    jwt:str = JwtEncoder(auth_jwt_key, -10, auth_jwt_renewMinutesBeforeExpiration)\
        .generate_string("paolo.francia", "Paolo", "customer", 1,"google", OIDC_AccessToken("123","456","789",120))

    response = client.get("/user", headers={"Authorization": f"Bearer {jwt}"})
    assert response.status_code == 401
