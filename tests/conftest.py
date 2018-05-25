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
        test_habit = Habit(name='test', description='this is a test', start_date=datetime.now())
        db.create_all()
        db.session.add(test_habit)
        db.session.commit()
        create_entries_for_habit(datetime.now(), test_habit, db)
    
    yield app
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    return app.test_client()


