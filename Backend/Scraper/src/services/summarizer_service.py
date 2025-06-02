import logging
from typing import List
from repository.article_repository import ArticleRepository
from repository.dbengine import DbEngine
from model.article import Article, Site
from summarizer.web_summarizer import WebSummarizer
from summarizer.llm_service import LLMService

logger = logging.getLogger('MainLogger')

class SummarizerService:
    def __init__(self):
        self.repository = ArticleRepository(DbEngine())
        self.llm_service = LLMService()
        self.summarizer = WebSummarizer(self.llm_service)

    def summarize_new_articles(self, site_url:str, article_prefix="/article/", max_articles:int=20):

        logger.info(f"Summarizing new articles of site  {site_url} using article prefix {article_prefix} and a maximum of {max_articles} articles...")
        article_urls = self.summarizer.get_article_links_from_page(site_url, article_prefix=article_prefix)
        new_urls=self.repository.list_article_urls_not_in_list(site_url,article_urls)[:max_articles]
        logger.info(f"found {len(new_urls)} new articles urls...")

        for i, article_url in enumerate(new_urls):
            logger.info(f"--- Summary {i} ---\n{article_url}")
            article=Article.create(url=article_url, site_url=site_url, summary="", title="")
            article.summary = self.summarizer.summarize_url(article.url)
            article.title = self.summarizer.get_title(article.summary)
            logger.info(f"title: {article.title}")
            self.summarizer.save_speech(f"{article.title} {article.summary}", article.speech_file)
            self.repository.add_article(article)

    def add_sites(self, sites:List[str]):
        saved_sites=self.repository.list_sites()
        for url in sites:
            if url not in [saved_site.site_url for saved_site in saved_sites]:
                site = Site.create(url)
                self.repository.add_site(site)
                logger.info(f"new site: {url}")

    def delete_old_articles(self, days_old:int):

        old_articles=self.repository.get_old_articles(days_old= days_old, max_items= 2000)
        for article in old_articles:
            # delete from DB and Disk
            logger.info(f"deleting article with id {article.id}...")
            self.repository.delete_article(article)
            logger.info(f"deleted article with id {article.id}!")

        return old_articles

