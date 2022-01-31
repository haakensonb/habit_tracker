from secrets import MAIL_USERNAME, MAIL_PASSWORD, MAIL_SERVER, SECRET_KEY, JWT_SECRET_KEY

# Change to whatever port React starts on
FRONTEND_URL_BASE = 'http://localhost:3000'

class base_config(object):
    """Default config options"""
    SECRET_KEY = SECRET_KEY
    JWT_SECRET_KEY = JWT_SECRET_KEY

    SQLALCHEMY_DATABASE_URI = 'sqlite:///database.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    MAIL_SERVER = MAIL_SERVER
    MAIL_USERNAME = MAIL_USERNAME
    MAIL_PASSWORD = MAIL_PASSWORD
    MAIL_PORT = 2525
    MAIL_DEBUG = False
    MAIL_SUPPRESS_SEND = False

    JWT_SECRET_KEY = JWT_SECRET_KEY
    JWT_BLACKLIST_ENABLED = True
    JWT_BLACKLIST_TOKEN_CHECKS = ['access', 'refresh']

class test_config(base_config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///memory'
    MAIL_DEBUG = True
    MAIL_SUPPRESS_SEND = True