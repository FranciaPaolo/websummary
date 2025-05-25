import json
import logging
from typing import List
from fastapi import APIRouter, Query, Depends
from pydantic import BaseModel
#from repository.query.filter import FilterJson
from services.service_singleton import summarizer_service
from repository.filter import FilterJson
from fastapi.responses import FileResponse
from repository.filter_article import FilterArticles
from package_auth.jwtTokenObj import JwtTokenObj
from package_auth.requires_roles import requires_role
from config.config import app_settings

router = APIRouter()
logger = logging.getLogger('MainLogger')


@router.get("/summary/sitesurl", )
async def get_sitesurl(user: JwtTokenObj = Depends(requires_role(["customer"], app_settings))):
    # TODO filter by user
    sites = summarizer_service.repository.list_sites()
    return [site.site_url for site in sites]

@router.post("/summary/articleslatest", )
async def get_articlelatest(filters:FilterArticles, user: JwtTokenObj = Depends(requires_role(["customer"], app_settings))):
    id_user =  user.get_id_user()
    return summarizer_service.repository.list_latest_articles_by_user(
        id_user=id_user,
        site_urls=filters.site_urls,
        last_days=filters.last_days,
        sort_desc_date=True,
        page=filters.page,
        itemsPerPage=filters.itemsPerPage)

@router.get("/summary/audio", )
async def get_articlelatest(id:str= Query(...)):
    # TODO check if article can be read by the user
    audio_file = summarizer_service.repository.get_article_audio(id)
    return FileResponse(audio_file, media_type="audio/mpeg", filename="audio.mp3") # TODO: if the file is big return a stream


class ArticleReadRequest(BaseModel):
    id_articles: List[str]

@router.post("/summary/articlesread", )
async def post_article_read(request:ArticleReadRequest, user: JwtTokenObj = Depends(requires_role(["customer"], app_settings))):
    id_user =  user.get_id_user()
    summarizer_service.repository.mark_article_as_read(id_user=id_user, id_articles=request.id_articles)
    return {"status": "ok"}





