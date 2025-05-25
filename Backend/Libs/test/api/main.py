import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import sys
sys.path.append(os.path.dirname(__file__))
from api1 import router as api1_routes

# Setup logger instance
#logging.config.fileConfig('logging.conf')

# Get the logger instance
logger = logging.getLogger('MainLogger')

# App definition
app=FastAPI(title="Langchain Server",
        version="1.0",
        description="A simple Api server")

app.include_router(api1_routes)

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

if __name__=="__main__":
    import uvicorn
    logger.debug(f"Starting server at port 8082...")
    uvicorn.run("main:app", host="0.0.0.0",port=8082, reload=False)