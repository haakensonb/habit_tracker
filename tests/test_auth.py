from habit_tracker.models import (
    User
)
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token
)


def test_user_registration_post(client, app):
    response = client.post('/auth/registration', json={
        'username': 'test_user',
        'password': 'test_password'
    })
    data = response.get_json()
    with app.app_context():
        user = User.find_by_username('test_user')
        assert user
        assert user.username == 'test_user'
        assert User.verify_hash('test_password', user.password)
    
    assert data['message'] == 'user was created'
    assert data['access_token']
    assert data['refresh_token']


def test_user_registration_already_exists(client):
    response = client.post('/auth/registration', json={
        'username': 'user_1',
        'password': 'test'
    })
    data = response.get_json()
    assert data['message'] == 'user user_1 already exists'


def test_login_user_doesnt_exist(client):
    response = client.post('/auth/login', json={
        'username': 'phil',
        'password': 'test'
    })
    data = response.get_json()
    assert data['message'] == 'User phil doesn\'t exist'


def test_login_password_incorrect(client):
    response = client.post('/auth/login', json={
        'username': 'user_1',
        'password': 'wrong password'
    })
    data = response.get_json()
    assert data['message'] == 'Wrong credentials'


def test_login_post(client):
    response = client.post('/auth/login', json={
        'username': 'user_1',
        'password': 'test'
    })
    data = response.get_json()
    assert data
    assert data['message'] == 'Logged in as user_1'
    assert data['access_token']
    assert data['refresh_token']


def test_user_logout_access_token(client, app):
    with app.app_context():
        access_token = create_access_token(identity='test')
        headers = {
            'Authorization': 'Bearer {}'.format(access_token)
        }
        response = client.post('/auth/logout/access', headers=headers)
        data = response.get_json()
        assert data['message'] == 'Access token has been revoked'


def test_user_logout_refresh_token(client, app):
    with app.app_context():
        refresh_token = create_refresh_token(identity='test')
        headers = {
            'Authorization': 'Bearer {}'.format(refresh_token)
        }
        response = client.post('/auth/logout/refresh', headers=headers)
        data = response.get_json()
        assert data['message'] == 'Refresh token has been revoked'


def test_user_token_refresh(client, app):
    with app.app_context():
        refresh_token = create_refresh_token(identity='test')
        headers = {
            'Authorization': 'Bearer {}'.format(refresh_token)
        }
        response = client.post('/auth/token/refresh', headers=headers)
        data = response.get_json()
        assert data['access_token']