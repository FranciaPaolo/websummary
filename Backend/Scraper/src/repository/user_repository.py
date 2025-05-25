import logging
from sqlalchemy.orm import Session

from model.usermember import UserMember
from repository.dbengine import DbEngine

logger = logging.getLogger('MainLogger')

class DbRepositoryUser:

    def __init__(self, db_engine: DbEngine):
        self.db_engine = db_engine

    def add_or_update_user(self, user:UserMember):
        # Create a session
        session = self.db_engine.get_session()
        try:
            if user.is_new():
                session.add(user)
                session.flush()
            else:
                session.merge(user)

            session.commit()
        except Exception as e:
            # If there's an error, roll back the session and print the error
            session.rollback()
            print(f"Error creating entity: {e}")
        finally:
            # Close the session
            session.close()

    def find_by_email(self, email:str):
        result=[]
        session:Session = self.db_engine.get_session()
        try:
          result = session.query(UserMember).filter(UserMember.email == email).all()
        finally:
          # Close the session
          session.close()

        return result[0] if len(result)>0 else None

    def find_by_id(self, id_user:str):
        result=[]
        session:Session = self.db_engine.get_session()
        try:
          result = session.query(UserMember).filter(UserMember.id_user == id_user).all()
        finally:
          # Close the session
          session.close()

        return result[0] if len(result)>0 else None
