from datetime import datetime, timedelta
from typing import List
from model.article import Article, Site, ArticleRead
from repository.dbengine import DbEngine
from sqlalchemy.orm import aliased
from sqlalchemy import not_


class ArticleRepository:

    def __init__(self, db_engine: DbEngine):
        self.db_engine = db_engine

    def list_sites(self):
        session = self.db_engine.get_session()
        try:
            return session.query(Site).all()
        finally:
            session.close()

    def list_articles(self, site_url:str):
        session = self.db_engine.get_session()
        try:
            return session.query(Article).filter(Article.site_url == site_url).all()
        finally:
            session.close()

    def list_latest_articles_by_user(self, id_user:int,
                                     site_urls:List[str],
                                     last_days:int=3,
                                     sort_desc_date:bool=True,
                                     page:int=0,
                                     itemsPerPage:int=10):
        session = self.db_engine.get_session()
        try:
            offset=page*itemsPerPage

            # Exclude articles that are in ArticleRead for the given user
            min_date = datetime.today()- timedelta(days=last_days)
            query = session.query(Article.id, Article.title, Article.site_url, Article.update_date, Article.url)\
                .filter(
                    Article.site_url.in_(site_urls),
                    ~Article.id.in_(
                        session.query(ArticleRead.id_article).filter(ArticleRead.id_user == id_user)
                    ),
                    Article.update_date >= min_date
                )
            # Apply sort
            if sort_desc_date:
                query = query.order_by(Article.update_date.desc())
            else:
                query = query.order_by(Article.update_date.asc())
            # Apply pagination
            query = query.limit(itemsPerPage).offset(offset)
            articles = query.all()

            return [{"id":id,"title": title, "site_url": site_url, "update_date": update_date, "url": url}
                    for id, title, site_url, update_date, url
                    in articles]
        finally:
            session.close()

    def get_article_audio(self, id:str):
        session = self.db_engine.get_session()
        try:
            articles = session.query(Article.speech_file)\
                .filter(Article.id == id)\
                .all()
            if len(articles) == 0:
                return None

            return articles[0].speech_file
        finally:
            session.close()

    def list_article_urls_not_in_list(self, site_url:str, article_urls:List[str]):

        saved_articles = self.list_articles(site_url)
        urls_not_in_list=[url for url in article_urls if url not in [article.url for article in saved_articles]]
        return urls_not_in_list

    def add_article(self, article:Article):
        session = self.db_engine.get_session()
        try:
            session.add(article)
            session.flush()
            session.commit()
        finally:
            session.close()

    def add_site(self, site:Site):
        session = self.db_engine.get_session()
        try:
            session.add(site)
            session.flush()
            session.commit()
        finally:
            session.close()

    def mark_article_as_read(self, id_articles:List[str], id_user:int):
        session = self.db_engine.get_session()
        try:

            for id_article in id_articles:
                articleRead=ArticleRead.create(id_article=id_article, id_user=id_user)
                session.add(articleRead)

            session.flush()
            session.commit()
        finally:
            session.close()



