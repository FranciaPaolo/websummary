from sqlalchemy import Engine, create_engine, text
from model.article import Base
from sqlalchemy.orm import sessionmaker, Session, Query
from config import config
# imports required to create the tables
import model.usermember
import model.article

class DbEngine:

    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DbEngine, cls).__new__(cls)
            cls._instance.__initialized = False
        return cls._instance

    def __init__(self):
        if self.__initialized:
            return

        # Create the database tables if they don't exist
        self.engine = create_engine(config.app_settings["database_url"])#, echo=True)
        self.createDefaults(self.engine)
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        self.__initialized = True

    @staticmethod
    def createDefaults(_engine:Engine):

        # Create schema if it doesn't exist
        with _engine.connect() as connection:
            connection.execute(text("CREATE SCHEMA IF NOT EXISTS users"))
            connection.commit()

    def get_session(self):
        return self.Session()