# sample config, mostly the same as in flask documentation
import os

from flask import Flask

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

    from habit_tracker.models import db, ma
    db.init_app(app)
    ma.init_app(app)

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
    def hello():
        return 'Hello World!'
    
    # register the api blueprint with the app
    from . import api
    app.register_blueprint(api.bp)

    # register auth blueprint
    from . import auth
    app.register_blueprint(auth.bp)

    return app