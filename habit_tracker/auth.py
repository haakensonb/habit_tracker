from flask import (
    Blueprint, request, jsonify
)
from flask.views import MethodView
from habit_tracker.models import user_schema, User

bp = Blueprint('auth', __name__, url_prefix='/auth')

class UserRegistration(MethodView):
    def post(self):
        user_data = user_schema.load(request.json).data
        new_user = User(
            username=user_data['username'],
            password=User.generate_hash(user_data['password'])
        )
        if User.find_by_username(user_data['username']):
            return jsonify({'message': 'user {} already exists'.format(user_data['username'])})

        new_user.save()
        return jsonify({'message': 'user was created'})


class UserLogin(MethodView):
    def post(self):
        user_data = user_schema.load(request.json).data
        current_user = User.find_by_username(user_data['username'])
        if not current_user:
            return jsonify({'message': 'User {} doesn\'t exist'.format(user_data['username'])})

        if User.verify_hash(user_data['password'], current_user.password):
            return jsonify({'message': 'Logged in as {}'.format(current_user.username)})
        else:
            return jsonify({'message': 'Wrong credentials'})


class UserLogoutAccess(MethodView):
    def post(self):
        pass


class UserLogoutRefresh(MethodView):
    def post(self):
        pass


class TokenRefresh(MethodView):
    def post(self):
        pass


bp.add_url_rule('/registration', view_func=UserRegistration.as_view('registration'))
bp.add_url_rule('/login', view_func=UserLogin.as_view('login'))
bp.add_url_rule('/logout/access', view_func=UserLogoutAccess.as_view('logout_access'))
bp.add_url_rule('/logout/refresh', view_func=UserLogoutRefresh.as_view('logout_refresh'))
bp.add_url_rule('/token/refresh', view_func=TokenRefresh.as_view('token_refresh'))