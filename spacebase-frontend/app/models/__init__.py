from app import app
from flask.ext.sqlalchemy import SQLAlchemy
import re

db = SQLAlchemy(app)

from sqlalchemy.engine import Engine
from sqlalchemy import event

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if (not re.match(r"^sqlite",app.config['SQLALCHEMY_DATABASE_URI'])):
        return

    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

# import models here so that flask-migrate will pick up any changes
from .user import User
