from sqlalchemy import Engine, create_engine, text
from model.article import Base
from sqlalchemy.orm import sessionmaker, Session, Query
from config import config
# imports required to create the tables
import model.usermember
import model.article

class DbEngine:
    """
    This class provides a default implementation for the repository interface.
    It uses an SQLite database to store and retrieve articles.
    """

    def __init__(self):
        # Create the database tables if they don't exist
        self.engine = create_engine(config.app_settings["database_url"])#, echo=True)
        self.createDefaults(self.engine)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)

    @staticmethod
    def createDefaults(_engine:Engine):

        # Create schema if it doesn't exist
        with _engine.connect() as connection:
            connection.execute(text("CREATE SCHEMA IF NOT EXISTS users"))
            connection.commit()

    def get_session(self):
        return self.Session()