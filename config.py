import os
from dotenv import load_dotenv

base_dir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(base_dir, '.env'))

PORT = os.environ.get('REACT_APP_PORT')
URL = os.environ.get('REACT_APP_URL')
FRONTEND_URL_BASE = f'{URL}:{PORT}'

class base_config(object):
    """Default config options"""
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')

    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = os.environ.get('MAIL_SERVER')
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
    MAIL_PORT = 2525
    MAIL_DEBUG = False
    MAIL_SUPPRESS_SEND = False

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']

class test_config(base_config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///memory'
    MAIL_DEBUG = True
    MAIL_SUPPRESS_SEND = True