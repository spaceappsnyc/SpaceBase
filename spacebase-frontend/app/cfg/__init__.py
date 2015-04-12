import os
from app import app

TOKEN_SECRET_KEY = 'super-secret'
SQLALCHEMY_DATABASE_URI = os.environ['DB_URI']

if (os.environ['FLASK_ENV'] == 'prod'):
	DEBUG = False
else:
	DEBUG = True
