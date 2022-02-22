import random
import pytest
from habit_tracker import create_app
from habit_tracker.models import Habit, Entry, User
from habit_tracker.models import db as _db
from config import test_config
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

