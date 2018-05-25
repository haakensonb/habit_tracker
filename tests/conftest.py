import os
import tempfile
from datetime import datetime

import pytest
from habit_tracker import create_app
from habit_tracker.models import db, Habit, Entry
from habit_tracker.api import create_entries_for_habit

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
        test_habit1 = Habit(name='test', description='this is a test', start_date=datetime.now())
        test_habit2 = Habit(name='test2', description='also a test', start_date=datetime.now())
        db.create_all()
        db.session.add(test_habit1)
        db.session.add(test_habit2)
        db.session.commit()
        create_entries_for_habit(datetime.now(), test_habit1, db)
        create_entries_for_habit(datetime.now(), test_habit2, db)
    
    yield app
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    return app.test_client()


