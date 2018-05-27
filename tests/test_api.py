from habit_tracker.models import (
    habit_schema, habits_schema, Habit, Entry, db, entry_schema, entries_schema
)
from habit_tracker.api import create_entries_for_habit
from datetime import datetime


def test_habits_api_get_by_id(client):
    response = client.get('/api/habits/1')
    data = habit_schema.load(response.json)[0]
    assert data['name'] == 'test'
    assert data['description'] == 'this is a test'
    assert data['entries']


def test_habits_api_get_by_listing(client):
    response = client.get('/api/habits/')
    data = habits_schema.load(response.json)[0]
    # also need to test start_date at some point
    assert data[0]['name'] == 'test'
    assert data[0]['description'] == 'this is a test'
    assert data[0]['entries']

    assert data[1]['name'] == 'test2'
    assert data[1]['description'] == 'also a test'
    assert data[1]['entries']


def test_habits_api_post(client):
    response = client.post('/api/habits/', json={
        'name': 'new habit', 'description': 'this is a new habit'
    })
    data = habit_schema.load(response.json)[0]
    assert data['name'] == 'new habit'
    assert data['description'] == 'this is a new habit'
    assert data['entries']


def test_habits_api_delete(client, app):
    response = client.delete('/api/habits/1')
    data = habit_schema.load(response.json)[0]
    assert data['name'] == 'test'
    assert data['description'] == 'this is a test'
    assert data['entries']

    with app.app_context():
        habit = Habit.query.get(1)
        first_entry = Entry.query.get(1)
        last_entry = Entry.query.get(49)
        assert not habit
        assert not first_entry
        assert not last_entry


def test_habits_api_patch(client, app):
    response = client.patch('/api/habits/2', json={
        'name': 'patched test', 'description': 'changed'
    })
    data = habit_schema.load(response.json)[0]
    assert data['name'] == 'patched test'
    assert data['description'] == 'changed'
    assert data['entries']

    with app.app_context():
        habit = Habit.query.get(2)
        assert habit.name == 'patched test'
        assert habit.description == 'changed'
        assert habit.entries


def test_create_entries_for_habit(client, app):
    with app.app_context():
        test_habit = Habit(name='test habit', description='blah blah', start_date=datetime.now())
        db.session.add(test_habit)
        db.session.commit()
        create_entries_for_habit(datetime.now(), test_habit, db)
        entries = Entry.query.filter(Entry.habit_id == test_habit.id).all()
        assert len(entries) == 49
        for entry in entries:
            assert entry.status == 'empty'
            assert entry.habit_id == test_habit.id


def test_entry_api_get(client, app):
    response = client.get('/api/entry/1')
    data = entry_schema.load(response.json).data
    assert data
    assert data['status'] == 'empty'


def test_entry_api_patch(client, app):
    response = client.patch('/api/entry/1', json={
        'status': 'completed'
    })
    data = entry_schema.load(response.json).data
    assert data
    assert data['status'] == 'completed'

