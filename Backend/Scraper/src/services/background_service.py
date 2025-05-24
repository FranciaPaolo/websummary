import logging
from services.service_singleton import summarizer_service
from config import config

logger = logging.getLogger('MainLogger')

class BackgroundService:

    @staticmethod
    def summary_task():
        try:
            logger.info(f"starting background task, maximum {config.app_settings['summary_task_max_articles']} articles per site...")

            sites = summarizer_service.repository.list_sites()
            logger.info(f"{len(sites)} sites found in the database...")

            for idx, site in enumerate(sites, start=1):
                logger.info(f"[{idx}/{len(sites)}] summarizing website {site.site_url}...")
                summarizer_service.summarize_new_articles(site_url=site.site_url, max_articles=config.app_settings["summary_task_max_articles"])
                logger.info(f"[{idx}/{len(sites)}] summarizing website {site.site_url} completed!")
        except Exception as e:
            logger.error(f"Error in background task: {str(e)}")
            raise e