# Python Library used by the other Apis

Project structure:
- `test` folder contains some tests of the package_auth (to run them in the root run `pytest`)
- `package_auth` is the library

## Setup
Setup the virtual environment
```
conda create -p venv python=3.10
conda activate ./venv
```


Install the package_auth package:
```
cd ./package_auth
pip install -e .
```

## Authorize Api based on the bearer

How to install:
* activate the virtual environment of the api in which you want to install
* go in the package_auth folder > `cd Backend/Libs/package_auth`
* run `pip install -e .`

Usage of JWT to authenticate api:
```
@router.get("/user/", )
async def user(user: JwtTokenObj = Depends(requires_role(["customer"], config.app_settings))):
    # TODO store the jwt in a database for validation
    logger.debug("GET /user/")
    return {f"message": "Hello, User {user}!"}
```

