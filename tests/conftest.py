import os
import tempfile
from datetime import datetime

import pytest
from habit_tracker import create_app
from habit_tracker.models import db, Habit

@pytest.fixture
def app():
    db_fd, db_path = tempfile.mkstemp()

    app = create_app({
        'TESTING': True,
        'DATABASE': db_path
    })

    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path

    with app.app_context():
        test = Habit(name='test', description='this is a test', start_date=datetime.now())
        db.create_all()
        db.session.add(test)
        db.session.commit()
    
    yield app
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    return app.test_client()


