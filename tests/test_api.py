from habit_tracker.models import habit_schema, habits_schema


def test_habits_api_get_by_id(client):
    response = client.get('/api/habits/1')
    data = habit_schema.load(response.json)
    assert data[0]['name'] == 'test'
    assert data[0]['description'] == 'this is a test'


def test_habits_api_get_by_listing(client):
    response = client.get('/api/habits/')
    data = habits_schema.load(response.json)
    # also need to test start_date at some point
    assert data[0][0]['name'] == 'test'
    assert data[0][0]['description'] == 'this is a test'

    assert data[0][1]['name'] == 'test2'
    assert data[0][1]['description'] == 'also a test'


