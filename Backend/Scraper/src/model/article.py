from datetime import datetime
import os
from urllib.parse import urlparse
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime
from model import Base
from utility.file_utility import FileUtility


class Article(Base):

    __tablename__ = 'articles'  # The name of the table

    id = Column(String, primary_key=True)
    url = Column(String)
    site_url = Column(String)
    summary = Column(String)
    title = Column(String)
    update_date = Column(DateTime)
    speech_file = Column(String)

    @staticmethod
    def create(
            url: str,
            site_url:str,
            summary: str,
            title: str):

        article=Article()
        article.id = article.generate_speech_filename(date=None, include_title=False)
        article.url = url
        article.site_url = site_url
        article.summary = summary
        article.title = title
        article.update_date = datetime.now()
        article.speech_file = os.path.join(FileUtility.get_speech_root_path(), article.get_speech_folder_name(article.site_url), f"{article.id}.mp3")
        return article



    def generate_speech_filename(self, date:datetime=None, include_title:bool=False) -> str:
        """
        Generate a unique code for the article to be used as a filename
        """
        if date is None:
            date = datetime.now()

        datetime_str=date.strftime("%Y%m%d_%H%M%S%f")[:-3] # YYYYMMDD_HHMMSSmmm
        filename=f"{datetime_str}"

        if include_title:
            title_str = ''.join(c for c in self.title if c.isalnum() or c in (' ', '_')).rstrip()
            filename=f"{filename}_{title_str}"

        return filename[:30]

    def get_speech_folder_name(self, site_url: str) -> str:
        """
        Get the path of the site speeches
        """
        return urlparse(site_url).netloc




class Site(Base):
    __tablename__ = 'sites'  # The name of the table

    site_url = Column(String, primary_key=True)
    article_prefix = Column(String)

    @staticmethod
    def create(url: str, article_prefix: str = "/article/") -> 'Site':

        if(url is None or url == ""):
            raise ValueError("site_url cannot be empty")

        if(article_prefix is None or article_prefix == ""):
            article_prefix = "/article/"

        site=Site()
        site.site_url = url
        site.article_prefix = article_prefix
        return site


class ArticleRead(Base):
    __tablename__ = 'articles_read'  # The name of the table

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_user = Column(Integer)
    id_article = Column(String)
    date_read = Column(DateTime)

    @staticmethod
    def create(id_user:int, id_article:str) -> 'ArticleRead':
        article_read=ArticleRead()
        article_read.id_user = id_user
        article_read.id_article = id_article
        article_read.date_read = datetime.now()
        return article_read