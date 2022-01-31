import email
import os
import random
import tempfile
from datetime import datetime
from click import password_option

import pytest
import sqlalchemy
from habit_tracker import create_app
from habit_tracker.models import Habit, Entry, User
from habit_tracker.models import db as _db
from config import test_config

from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
import factory


class UserFactory(factory.alchemy.SQLAlchemyModelFactory):
    id = factory.Sequence(lambda n: f'{n}')
    email = factory.Faker('email')
    username = factory.Faker('user_name')
    password = factory.LazyAttribute(lambda p: User.generate_hash(p.username))
    email_confirmed = 1

    class Meta:
        model = User
        sqlalchemy_session = _db.session

class HabitFactory(factory.alchemy.SQLAlchemyModelFactory):
    id = factory.Sequence(lambda n: f'{n}')
    name = factory.Faker('name')
    description = factory.Faker('text')
    start_date = factory.Faker('date_object')
    user_id = factory.LazyAttribute(lambda n: UserFactory().id)

    class Meta:
        model = Habit
        sqlalchemy_session = _db.session

class EntryFactory(factory.alchemy.SQLAlchemyModelFactory):
    id = factory.Sequence(lambda n: f'{n}')
    entry_day = factory.Faker('date_object')
    # Status can be 'empty', 'failed', 'complete' respectively represented by following choices
    status = factory.LazyFunction(lambda: random.choice(['\u00a0', 'O', 'X']))
    habit_id = factory.LazyAttribute(lambda n: HabitFactory().id)
    user_id = factory.LazyAttribute(lambda n: UserFactory().id)

    class Meta:
        model = Entry
        sqlalchemy_session = _db.session


@pytest.fixture
def app():
    app = create_app(test_config)
    yield app

@pytest.fixture
def client(app):
    with app.test_client() as client:
        with app.app_context():
            _db.drop_all()
            _db.create_all()
        yield client

@pytest.fixture
def db(app):
    app.app_context().push()
    _db.init_app(app)
    _db.create_all()
    yield _db
    _db.session.close()
    _db.drop_all()

# engine = create_engine(test_config.SQLALCHEMY_DATABASE_URI)
# Session = sessionmaker()

# @pytest.fixture(scope='module')
# def connection():
#     connection = engine.connect()
#     yield connection
#     connection.close()

# @pytest.fixture(scope='function')
# def session(connection):
#     transaction = connection.begin()
#     session = Session(bind=connection)
#     # Use factory with session
#     UserFactory._meta.sqlalchemy_session = session
#     yield session
#     session.close()
#     transaction.rollback()


# @pytest.fixture(scope='module')
# def user_email_confirmed():
#     user = User(
#                 email='user_1@fake.com',
#                 username='user_1',
#                 password=User.generate_hash('test'),
#                 email_confirmed=1
#             )
#     return user

# @pytest.fixture(scope='module')
# def user_email_not_confirmed():
#     user = User(
#                 email='user_2@fake.com',
#                 username='user_2',
#                 password=User.generate_hash('test')
#             )
#     return user

# @pytest.fixture(scope='module')
# def habit_with_entries(user_email_confirmed):
#     habit = Habit(name='test', description='this is a test', start_date=datetime.now(), user_id=user_email_confirmed.id)
#     habit.create_entries(datetime.now(), user_email_confirmed)
#     return habit


# @pytest.fixture(scope='session')
# def app(request):
#     """Create session wide flask app"""
#     app = create_app(test_config)
#     return app

# @pytest.fixture
# def client(app):
#     return app.test_client()

# @pytest.fixture(autouse=True)
# def _setup_app_context_for_test(request, app):
#     """
#     Sets up app context per test to make sure that app and request
#     stack isn't shared between tests
#     """
#     ctx = app.app_context()
#     ctx.push()
#     # Tests will run here
#     yield
#     ctx.pop()

# @pytest.fixture(scope='session')
# def db(app, request):
#     """Get session wide initialized database"""
#     with app.app_context():
#         _db.create_all()
#         yield _db
#         _db.drop_all()

# @pytest.fixture(scope='function')
# def session(app, db, request):
#     """Creates a new db session for each test and rolls back changes afterwards"""
#     connection = _db.engine.connect()
#     transaction = connection.begin()

#     options = dict(bind=connection, binds={})
#     session = _db.create_scoped_session(options=options)

#     _db.session = session

#     yield session

#     transaction.rollback()
#     connection.close()
#     session.remove()

# @pytest.fixture
# def app():
#     db_fd, db_path = tempfile.mkstemp()

#     app = create_app({
#         'TESTING': True,
#         'DATABASE': db_path
#     })

#     app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
#     app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#     with app.app_context():
#         db.create_all()
#         user_1 = User(
#             email='user_1@fake.com',
#             username='user_1',
#             password=User.generate_hash('test'),
#             email_confirmed=1
#         )
#         user_2 = User(
#             email='user_2@fake.com',
#             username='user_2',
#             password=User.generate_hash('test')
#         )
#         db.session.add(user_1)
#         db.session.add(user_2)
#         # have to commit the users first so that their id's can
#         # be used to create habits properly
#         db.session.commit()

#         test_habit1 = Habit(name='test', description='this is a test', start_date=datetime.now(), user_id=user_1.id)
#         test_habit2 = Habit(name='test2', description='also a test', start_date=datetime.now(), user_id=user_1.id)
#         test_habit3 = Habit(name='test3', description='test for user_2', start_date=datetime.now(), user_id=user_2.id)
#         db.session.add(test_habit1)
#         db.session.add(test_habit2)
#         db.session.add(test_habit3)
#         db.session.commit()
#         test_habit1.create_entries(datetime.now(), user_1)
#         test_habit2.create_entries(datetime.now(), user_1)
#         test_habit3.create_entries(datetime.now(), user_2)
    
#     yield app
#     os.close(db_fd)
#     os.unlink(db_path)

