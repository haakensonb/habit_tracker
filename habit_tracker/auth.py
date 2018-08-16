from flask import (
    Blueprint, request, jsonify, abort, current_app, url_for
)
from flask.views import MethodView
from habit_tracker.models import user_schema, User, RevokedToken
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    jwt_refresh_token_required, get_jwt_identity, get_raw_jwt
)
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message

mail = Mail()


bp = Blueprint('auth', __name__, url_prefix='/auth')

@bp.route('/confirm_email')
def confirm_email():
    return 'cool'

class UserRegistration(MethodView):
    def post(self):
        user_data = user_schema.load(request.json).data
        new_user = User(
            email=user_data['email'],
            username=user_data['username'],
            password=User.generate_hash(user_data['password'])
        )
        if User.find_by_username(user_data['username']):
            # user already exists so raise some sort of error
            return abort(422)

        new_user.save()
        # access_token = create_access_token(identity=user_data['username'])
        # refresh_token = create_refresh_token(identity=user_data['username'])
        # return jsonify({
        #     'message': 'user was created',
        #     'access_token': access_token,
        #     'refresh_token': refresh_token,
        #     'username': new_user.username
        #     })

        email_token_serializer = URLSafeTimedSerializer(current_app.config["SECRET_KEY"])
        email_token = email_token_serializer.dumps(new_user.email, salt='email-confirm-key')
        confirm_url = url_for('auth.confirm_email', email_token=email_token, _external=True)

        msg = Message(
            'Please verify email for Habit Tracker',
            sender='no-reply@example.com',
        )
        msg.add_recipient(new_user.email)
        msg.html = 'Hi {}! <br/> Please go to this link to confirm your email <a href="{}">{}<a/>'.format(new_user.username ,confirm_url, confirm_url)
        mail.send(msg)

        return jsonify({
            'message': 'User was created. Please verify email before logging in'
        })


class UserLogin(MethodView):
    def post(self):
        user_data = user_schema.load(request.json).data
        current_user = User.find_by_username(user_data['username'])
        # if we can't find that user return error
        if not current_user:
            return abort(401)

        if current_user.email_confirmed != 1:
            return jsonify({
                'message': 'You must verify your email address before you can login'
            })

        if User.verify_hash(current_user.password, user_data['password']):
            access_token = create_access_token(identity=user_data['username'])
            refresh_token = create_refresh_token(identity=user_data['username'])

            return jsonify({
                'message': 'Logged in as {}'.format(current_user.username),
                'access_token': access_token,
                'refresh_token': refresh_token,
                'username': current_user.username
                })
        else:
            return abort(401)


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
            return abort(401)


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
            return abort(401)


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