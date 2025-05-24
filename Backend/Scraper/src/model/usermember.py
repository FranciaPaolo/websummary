from datetime import datetime
from sqlalchemy import Column, DateTime, Integer, String
from model import Base

###########################################################################################################
#
#      user
#      Represents the user of the system
#
###########################################################################################################

class UserMember(Base):
    __tablename__ = 'user'  # The name of the table
    __table_args__ = {'schema': 'users'}  # Specify the schema for the table

    id_user = Column(Integer, primary_key=True, auto_increment=True)
    fullname = Column(String)
    email = Column(String)
    picture = Column(String)
    role = Column(String) # default is customer
    last_token = Column(String)
    last_login_date = Column(DateTime)
    date_created = Column(DateTime)

    @staticmethod
    def create(id:int, fullname:str, email:str, picture:str):
        entity=UserMember()
        entity.id_user=id
        entity.fullname=fullname
        entity.email=email
        entity.picture=picture
        return entity

    def setEmail(self, email:str):
        self.email=email

    def setFullName(self, fullname:str):
        self.fullname=fullname

    def setPicture(self, picture:str):
        self.picture=picture

    def setDateCreated(self):
        self.date_created=datetime.now()

    def setLastLoginDate(self):
        self.last_login_date=datetime.now()

    def setLastToken(self, token:str):
        self.last_token=token

    def getIdUser(self):
        return self.id_user

    def is_new(self) -> bool:
        return True if self.id_user is None or self.id_user<=0 else False

    @staticmethod
    def create_user_from_oidc_user_info(refresh_token:str=None, name:str=None, email:str=None, picture:str=None):
        userData=UserMember()
        userData.setEmail(email)
        userData.setFullName(name)
        userData.setPicture(picture)
        userData.setDateCreated()
        userData.setLastLoginDate()
        return userData
