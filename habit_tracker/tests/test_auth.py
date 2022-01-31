from habit_tracker.models import (
    User
)
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token
)

from habit_tracker.tests.conftest import UserFactory


def test_user_registration_post(client, db):
    response = client.post('/auth/registration', json={
        'email': 'test_user@fake.com',
        'username': 'test_user',
        'password': 'test_password'
    })
    data = response.get_json()
    user = User.find_by_username('test_user')
    assert user
    assert user.username == 'test_user'
    assert User.verify_hash(user.password, 'test_password')
    assert data['message'] == 'User was created. Please verify email before logging in'


def test_user_registration_already_exists(client):
    user = UserFactory.create(username='user_1')
    user.save()
    response = client.post('/auth/registration', json={
        'email': 'user_1@fake.com',
        'username': 'user_1',
        'password': 'test'
    })
    assert response.status_code == 422


def test_login_user_doesnt_exist(client):
    response = client.post('/auth/login', json={
        'username': 'phil',
        'password': 'test'
    })
    assert response.status_code == 401


def test_login_password_incorrect(client):
    response = client.post('/auth/login', json={
        'username': 'user_1',
        'password': 'wrong password'
    })
    assert response.status_code == 401


def test_login_post(client):
    password = User.generate_hash('test')
    user = UserFactory.create(username='user_1', password=password)
    user.save()
    response = client.post('/auth/login', json={
        'username': 'user_1',
        'password': 'test'
    })
    data = response.get_json()
    assert data
    assert data['access_token']
    assert data['refresh_token']


def test_user_logout_access_token(client, db):
    user = UserFactory.create(username='test')
    user.save()
    access_token = create_access_token(identity='test')
    headers = {
        'Authorization': 'Bearer {}'.format(access_token)
    }
    response = client.post('/auth/logout/access', headers=headers)
    data = response.get_json()
    assert data['message'] == 'Access token has been revoked'


def test_user_logout_refresh_token(client, db):
    user = UserFactory.create(username='test')
    user.save()
    refresh_token = create_refresh_token(identity='test')
    headers = {
        'Authorization': 'Bearer {}'.format(refresh_token)
    }
    response = client.post('/auth/logout/refresh', headers=headers)
    data = response.get_json()
    assert data['message'] == 'Refresh token has been revoked'


def test_user_token_refresh(client, db):
    user = UserFactory.create(username='test')
    user.save()
    refresh_token = create_refresh_token(identity='test')
    headers = {
        'Authorization': 'Bearer {}'.format(refresh_token)
    }
    response = client.post('/auth/token/refresh', headers=headers)
    data = response.get_json()
    assert data['access_token']