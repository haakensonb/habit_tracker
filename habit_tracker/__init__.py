import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import jwt_required, JWTManager
from habit_tracker.models import RevokedToken, db, ma, bcrypt, User
from habit_tracker.auth import mail
from config import base_config

def create_app(test_config=None):
    # Create and configure the app
    app = Flask(__name__, static_url_path='', static_folder='../build', instance_relative_config=True)

    if test_config is None:
        app.config.from_object(base_config)
    else:
        # Load the test config if passed in
        app.config.from_object(test_config)

    # Setup sqlalchemy
    db.init_app(app)
    # Setup marshmallow
    ma.init_app(app)
    # Setup hashing
    bcrypt.init_app(app)
    # Setup flask mail
    mail.init_app(app)

    if test_config is None:
        with app.app_context():
            db.create_all()
            # Create demo account if it doesn't exist
            demo_account = User.query.filter_by(username='DemoAccount').first()
            if demo_account is None:
                u = User(email='demo@demo.com', username='DemoAccount', password=User.generate_hash('habitTester123'), email_confirmed=1)
                u.save()

    # Setup JWT
    jwt = JWTManager(app)
    @jwt.token_in_blacklist_loader
    def check_if_token_in_blacklist(decryted_token):
        jti = decryted_token['jti']
        return RevokedToken.is_jti_blacklisted(jti)

    # Setup CORS for react
    cors = CORS(app, origins=['http://localhost:3000', 'http://localhost:5000', 'http://0.0.0.0:3000', 'http://0.0.0.0:5000', 'http://127.0.0.1:3000', 'http://127.0.0.1:5000'])

    @app.route('/')
    def index():
        return app.send_static_file('index.html')
    
    # A simple test page that says hello
    @app.route('/hello')
    def hello():
        return 'Hello World!'

    # Register the api blueprint with the app
    from . import api
    app.register_blueprint(api.bp)

    # Register auth blueprint
    from . import auth
    app.register_blueprint(auth.bp)

    return app




