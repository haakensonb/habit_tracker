from habit_tracker.models import (
    habit_schema, habits_schema, Habit, Entry, db, entry_schema, entries_schema,
    User
)
from flask_jwt_extended import (
    create_access_token
)
from datetime import datetime

from habit_tracker.tests.conftest import EntryFactory, UserFactory, HabitFactory

def get_headers_access_token(username):
    access_token = create_access_token(identity=username)
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    return headers


def test_habits_api_get_by_id(client, db):
    habit = HabitFactory.create(name='test', description='this is a test')
    user = User.query.get(habit.user_id)
    headers = get_headers_access_token(user.username)
    url = f'/api/habits/{habit.id}'
    response = client.get(url, headers=headers)
    data = habit_schema.load(response.json).data
    assert data['name'] == 'test'
    assert data['description'] == 'this is a test'
    assert 'entries' in data.keys()


def test_habits_api_get_by_id_wrong_user(client, db):
    habit = HabitFactory.create()
    other_user = UserFactory.create()
    headers = get_headers_access_token(other_user.username)
    url = f'/api/habits/{habit.id}'
    response = client.get(url, headers=headers)
    assert response.json['message'] == 'That\'s not yours!'


def test_habits_api_get_by_listing(client, db):
    habit1 = HabitFactory.create()
    habit2 = HabitFactory.create(user_id=habit1.user_id)
    user = User.query.get(habit1.user_id)
    headers = get_headers_access_token(user.username)
    response = client.get('/api/habits/', headers=headers)
    data = habits_schema.load(response.json)[0]
    assert len(data) == 2
    assert data[0]['name'] == habit1.name
    assert data[1]['name'] == habit2.name


def test_habits_api_post(client, db):
    user = UserFactory.create(id=1)
    user.save()
    headers = get_headers_access_token(user.username)
    response = client.post('/api/habits/', headers=headers, json={
        'name': 'new habit', 'description': 'this is a new habit',
        'start_date': '1/10/2018'
    })
    data = habit_schema.load(response.json).data
    assert data['name'] == 'new habit'
    assert data['description'] == 'this is a new habit'
    assert data['entries']
    assert data['user_id'] == 1


def test_habits_api_delete(client, db):
    user = UserFactory.create(id=1)
    user.save()
    habit = HabitFactory.create(user_id=user.id, id=1, name='test')
    headers = get_headers_access_token(user.username)
    url = f'/api/habits/{habit.id}'
    response = client.delete(url, headers=headers)
    data = habit_schema.load(response.json).data
    assert data['name'] == 'test'
    habit_query = db.session.query(Habit).filter(Habit.id == 1).all()
    first_entry = Entry.query.get(1)
    last_entry = Entry.query.get(49)
    assert len(habit_query) == 0
    assert not first_entry
    assert not last_entry


def test_habits_api_put(client, db):
    user = UserFactory.create()
    user.save()
    habit = HabitFactory.create(id=2, user_id=user.id, name='test', description='test')
    db.session.commit()
    headers = get_headers_access_token(user.username)
    response = client.put('/api/habits/2', headers=headers, json={
        'name': 'patched test', 'description': 'changed',
        'id': 2, 'start_date': '2018-05-27T14:10:41.004412+00:00'
    })
    data = habit_schema.load(response.json).data
    assert data['name'] == 'patched test'
    assert data['description'] == 'changed'
    assert 'entries' in data.keys()

    habit = Habit.query.get(2)
    assert habit.name == 'patched test'
    assert habit.description == 'changed'
    assert hasattr(habit, 'entries')


def test_create_entries_for_habit(client, db):
    user = UserFactory.create()
    user.save()
    habit = HabitFactory.create()
    habit.create_entries(datetime.now(), user)
    entries = Entry.query.filter(Entry.habit_id == habit.id).all()
    assert len(entries) == 49
    assert all([
        (e.status == '\u00a0' and e.habit_id == habit.id) 
        for e in entries])


def test_entry_api_get(client, db):
    user = UserFactory.create()
    user.save()
    entry = EntryFactory.create(user_id=user.id)
    url = f'/api/entry/{entry.id}'
    headers = get_headers_access_token(user.username)
    response = client.get(url, headers=headers)
    data = entry_schema.load(response.json).data
    assert data
    assert data['status'] == entry.status


def test_entry_api_put(client, db):
    user = UserFactory.create()
    user.save()
    entry = EntryFactory.create(user_id=user.id)
    db.session.commit()
    url = f'/api/entry/{entry.id}'
    headers = get_headers_access_token(user.username)
    cur_time = datetime.now()
    response = client.put(url, headers=headers, json={
        'entry_day': f'{cur_time}',
        'id': 1,
        'status': 'completed'
    })
    data = entry_schema.load(response.json).data
    assert data
    assert data['status'] == 'completed'
