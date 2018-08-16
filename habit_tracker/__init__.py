# sample config, mostly the same as in flask documentation
import os

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import jwt_required, JWTManager
from habit_tracker.models import RevokedToken

from config import MT_USERNAME, MT_PASSWORD

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY='dev',
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
    app.config['MAIL_SERVER'] = 'smtp.mailtrap.io'
    app.config['MAIL_DEBUG'] = True
    app.config['MAIL_SUPPRESS_SEND'] = False
    app.config['MAIL_PORT'] = 2525
    app.config['MAIL_USERNAME'] = MT_USERNAME
    app.config['MAIL_PASSWORD'] = MT_PASSWORD

    from habit_tracker.auth import mail
    mail.init_app(app)

    app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
    app.config['JWT_BLACKLIST_ENABLED'] = True
    app.config['JWT_BLACKLIST_TOKEN_CHECKS'] = ['access', 'refresh']

    jwt = JWTManager(app)
    @jwt.token_in_blacklist_loader
    def check_if_token_in_blacklist(decryted_token):
        jti = decryted_token['jti']
        return RevokedToken.is_jti_blacklisted(jti)


    # setup CORS for react
    cors = CORS(app, origins=['http://localhost:3000'])

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




