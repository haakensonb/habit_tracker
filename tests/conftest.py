import os
import tempfile
from datetime import datetime

import pytest
from habit_tracker import create_app
from habit_tracker.models import db, Habit, Entry, User

@pytest.fixture
def app():
    db_fd, db_path = tempfile.mkstemp()

    app = create_app({
        'TESTING': True,
        'DATABASE': db_path
    })

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    with app.app_context():
        db.create_all()
        user_1 = User(
            username='user_1',
            password=User.generate_hash('test')
        )
        user_2 = User(
            username='user_2',
            password=User.generate_hash('test')
        )
        db.session.add(user_1)
        db.session.add(user_2)
        # have to commit the users first so that their id's can
        # be used to create habits properly
        db.session.commit()

        test_habit1 = Habit(name='test', description='this is a test', start_date=datetime.now(), user_id=user_1.id)
        test_habit2 = Habit(name='test2', description='also a test', start_date=datetime.now(), user_id=user_1.id)
        test_habit3 = Habit(name='test3', description='test for user_2', start_date=datetime.now(), user_id=user_2.id)
        db.session.add(test_habit1)
        db.session.add(test_habit2)
        db.session.add(test_habit3)
        db.session.commit()
        test_habit1.create_entries(datetime.now(), user_1)
        test_habit2.create_entries(datetime.now(), user_1)
        test_habit3.create_entries(datetime.now(), user_2)
    
    yield app
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    return app.test_client()


