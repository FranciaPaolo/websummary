from contextlib import asynccontextmanager
import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import logging.config
from config import config as config_settings
from api.summaryApi import router as summarizer_router
from api.authApi import router as auth_router
from api.usersApi import router as user_router
from apscheduler.schedulers.background import BackgroundScheduler
from services.background_service import BackgroundService
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger

# Setup logger instance
logging.config.fileConfig('logging.conf')

# Get the logger instance
logger = logging.getLogger('MainLogger')

##################################################################################
#
# uvicorn main:app --port 8082 --reload
#
##################################################################################

# Background Scheduler definition
scheduler = BackgroundScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    scheduler.add_job(BackgroundService.summary_task, CronTrigger(hour="5", minute="0"))
    scheduler.start()
    logger.info("🔁 Scheduler started")
    try:
        yield  # Let the app run
    finally:
        # # Shutdown logic
        scheduler.shutdown()
        logger.info("🛑 Scheduler stopped")


# App definition
app=FastAPI(title="Langchain Server",
        version="1.0",
        description="Api for the summary service",
        lifespan=lifespan)

app.include_router(summarizer_router)
app.include_router(auth_router)
app.include_router(user_router)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (use specific domains in production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)

    if isinstance(exc, ValueError):
        content={"message": str(exc)}
        if len(exc.args) > 1 and isinstance(exc.args[1], dict):
            print(exc.args[1])
            content.update(exc.args[1])
            content["message"]=exc.args[0]
        return JSONResponse(
            status_code=400,
            content=content,
            headers={"Access-Control-Allow-Origin": request.headers.get("origin", "*")},
        )
    return JSONResponse(
        status_code=500,
        content={"message": "Internal Server Error"},
    )

@app.exception_handler(404)
async def custom_404_handler(request: Request, exc: Exception):
    logger.debug(f"404 Not Found: {request.method} {request.url}")
    return JSONResponse(
        status_code=404,
        content={"message": "Resource not found"},
    )

# check mandatory env variables
if os.environ.get("LANG_SMITH") is None or os.environ.get("LANG_SMITH") == "":
    logger.debug(f"...ensure mandatory environment variables are set, you can use the .env file...")
    raise ValueError("Missing mandatory environment variable: LANG_SMITH")

if os.environ.get("GROQ_API_KEY") is None or os.environ.get("GROQ_API_KEY") == "":
    logger.debug(f"...ensure mandatory environment variables are set, you can use the .env file...")
    raise ValueError("Missing mandatory environment variable: GROQ_API_KEY")

if os.environ.get("USER_AGENT") is None or os.environ.get("USER_AGENT") == "":
    logger.debug(f"...ensure mandatory environment variables are set, you can use the .env file...")
    raise ValueError("Missing mandatory environment variable: USER_AGENT")


if __name__=="__main__":
    import uvicorn
    logger.debug(f"Starting server at port {config_settings.app_settings['api_port']}...")
    uvicorn.run("main:app", host="127.0.0.1",port=config_settings.app_settings["api_port"], reload=True)
