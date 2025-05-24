from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import logging.config
from services.service_singleton import summarizer_service
from services.background_service import BackgroundService

# Setup logger instance
logging.config.fileConfig('logging.conf')

# Get the logger instance
logger = logging.getLogger('MainLogger')

##################################################################################
#
#  this is only for testing purposes
#
##################################################################################


# summarizer_service.add_sites(["https://www.wired.com/"])

# BackgroundService.summary_task()

sites = summarizer_service.repository.list_sites()
site = [site for site in sites if site.site_url == "https://www.wired.com/"][0]
# logger.info(f"{len(sites)} sites found in the database...")
#print(f"{site.article_prefix}")
summarizer_service.summarize_new_articles(site_url=site.site_url, article_prefix=site.article_prefix, max_articles=2)
#summarizer_service.repository.mark_article_as_read(id_user=1, id_articles=["20250518_082929083"])
#tmp=summarizer_service.repository.list_latest_articles_by_user(id_user=1, site_urls=["https://www.wired.com/"],sort_desc_date=False, page=0, itemsPerPage=4)
#print(tmp)
