import logging
from services.service_singleton import summarizer_service
from config import config

logger = logging.getLogger('MainLogger')

class BackgroundService:

    @staticmethod
    def summary_task():
        try:
            # First summarize new articles
            logger.info(f"starting background task, maximum {config.app_settings['summary_task_max_articles']} articles per site...")

            sites = summarizer_service.repository.list_sites()
            logger.info(f"{len(sites)} sites found in the database...")

            for idx, site in enumerate(sites, start=1):
                logger.info(f"[{idx}/{len(sites)}] summarizing website {site.site_url}...")
                summarizer_service.summarize_new_articles(
                    site_url=site.site_url,
                    article_prefix=site.article_prefix,
                    max_articles=config.app_settings["summary_task_max_articles"])
                logger.info(f"[{idx}/{len(sites)}] summarizing website {site.site_url} completed!")

            # Second delete old articles
            logger.info(f"start deleting articles older than days: {config.app_settings['summary_task_delete_old_days']}...")
            summarizer_service.delete_old_articles(config.app_settings['summary_task_delete_old_days'])
            logger.info(f"deleting old articles done")

        except Exception as e:
            logger.error(f"Error in background task: {str(e)}")
            raise e