import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import jwt_required, JWTManager
from habit_tracker.models import RevokedToken

from config import MAIL_SERVER, MAIL_PORT, MAIL_DEBUG, MAIL_USERNAME, MAIL_PASSWORD, SECRET_KEY, JWT_SECRET_KEY, FRONTEND_URL_BASE

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, static_url_path='', static_folder='../build', instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=SECRET_KEY,
        DATABASE=os.path.join(app.instance_path, 'habit_tracker.sqlite')
    )
    # Works with three slashes after sqlite, even though documentation had four
    # This may not be the correct way to setup flask-SQLAlchemy
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    from habit_tracker.models import db, ma, bcrypt, User
    # setup sqlalchemy
    db.init_app(app)
    with app.app_context():
        db.create_all()
        # Create demo account if it doesn't exist
        demo_account = User.query.filter_by(username='DemoAccount').first()
        if demo_account is None:
            print('Creating DemoAccount user')
            u = User(email='demo@demo.com', username='DemoAccount', password=User.generate_hash('habitTester123'), email_confirmed=1)
            u.save()
        else:
            print('DemoAccount user already exists')
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
    # cors = CORS(app, origins=[FRONTEND_URL_BASE])
    # cors = CORS(app, origins=['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000'])
    cors = CORS(app, origins=['http://localhost:3000', 'http://localhost:5000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5000'])

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

    @app.route('/')
    def index():
        return app.send_static_file('index.html')
    
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




