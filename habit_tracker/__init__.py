import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import jwt_required, JWTManager
from habit_tracker.models import RevokedToken

from config import MAIL_SERVER, MAIL_PORT, MAIL_DEBUG, MAIL_USERNAME, MAIL_PASSWORD, SECRET_KEY, JWT_SECRET_KEY, FRONTEND_URL_BASE

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=SECRET_KEY,
        DATABASE=os.path.join(app.instance_path, 'habit_tracker.sqlite')
    )
    # Works with three slashes after sqlite, even though documentation had four
    # This may not be the correct way to setup flask-SQLAlchemy
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    from habit_tracker.models import db, ma, bcrypt
    # setup sqlalchemy
    db.init_app(app)
    # setup marshmallow
    ma.init_app(app)
    # setup hashing
    bcrypt.init_app(app)
    # setup flask mail
    app.config['MAIL_SERVER'] = MAIL_SERVER
    app.config['MAIL_DEBUG'] = MAIL_DEBUG
    app.config['MAIL_SUPPRESS_SEND'] = False
    app.config['MAIL_PORT'] = MAIL_PORT
    app.config['MAIL_USERNAME'] = MAIL_USERNAME
    app.config['MAIL_PASSWORD'] = MAIL_PASSWORD

    from habit_tracker.auth import mail
    mail.init_app(app)

    app.config['JWT_SECRET_KEY'] = JWT_SECRET_KEY
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

    jwt = JWTManager(app)
    @jwt.token_in_blacklist_loader
    def check_if_token_in_blacklist(decryted_token):
        jti = decryted_token['jti']
        return RevokedToken.is_jti_blacklisted(jti)


    # setup CORS for react
    cors = CORS(app, origins=[FRONTEND_URL_BASE])

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)
    

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    
    # a simple test page that says hello
    @app.route('/hello')
    # @jwt_required
    def hello():
        return 'Hello World!'


    # register the api blueprint with the app
    from . import api
    app.register_blueprint(api.bp)

    # register auth blueprint
    from . import auth
    app.register_blueprint(auth.bp)

    return app




