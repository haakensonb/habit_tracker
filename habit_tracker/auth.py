from flask import (
    Blueprint, request, jsonify
)
from flask.views import MethodView
from habit_tracker.models import user_schema, User, RevokedToken
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    jwt_refresh_token_required, get_jwt_identity, get_raw_jwt
)


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
        access_token = create_access_token(identity=user_data['username'])
        refresh_token = create_refresh_token(identity=user_data['username'])
        return jsonify({
            'message': 'user was created',
            'access_token': access_token,
            'refresh_token': refresh_token
            })


class UserLogin(MethodView):
    def post(self):
        user_data = user_schema.load(request.json).data
        current_user = User.find_by_username(user_data['username'])
        if not current_user:
            return jsonify({'message': 'User {} doesn\'t exist'.format(user_data['username'])})

        if User.verify_hash(user_data['password'], current_user.password):
            access_token = create_access_token(identity=user_data['username'])
            refresh_token = create_refresh_token(identity=user_data['username'])

            return jsonify({
                'message': 'Logged in as {}'.format(current_user.username),
                'access_token': access_token,
                'refresh_token': refresh_token
                })
        else:
            return jsonify({'message': 'Wrong credentials'})


class UserLogoutAccess(MethodView):
    @jwt_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedToken(jti=jti)
            revoked_token.add()
            return jsonify({
                'message': 'Access token has been revoked'
            })
        except:
            return jsonify({
                'message': 'Something went wrong'
            }), 500


class UserLogoutRefresh(MethodView):
    @jwt_refresh_token_required
    def post(self):
        jti = get_raw_jwt()['jti']
        try:
            revoked_token = RevokedToken(jti=jti)
            revoked_token.add()
            return jsonify({
                'message': 'Refresh token has been revoked'
            })
        except:
            return jsonify({
                'message': 'Something when wrong'
            }), 500


class TokenRefresh(MethodView):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        access_token = create_access_token(identity=current_user)
        return jsonify({
            'access_token': access_token
        })



bp.add_url_rule('/registration', view_func=UserRegistration.as_view('registration'))
bp.add_url_rule('/login', view_func=UserLogin.as_view('login'))
bp.add_url_rule('/logout/access', view_func=UserLogoutAccess.as_view('logout_access'))
bp.add_url_rule('/logout/refresh', view_func=UserLogoutRefresh.as_view('logout_refresh'))
bp.add_url_rule('/token/refresh', view_func=TokenRefresh.as_view('token_refresh'))