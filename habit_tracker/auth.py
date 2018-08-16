from flask import (
    Blueprint, request, jsonify, abort
)
from flask.views import MethodView
from habit_tracker.models import user_schema, User, RevokedToken, db, RevokedResetToken
from flask_jwt_extended import (
    create_access_token, create_refresh_token, jwt_required,
    jwt_refresh_token_required, get_jwt_identity, get_raw_jwt
)
from itsdangerous import URLSafeTimedSerializer
from flask_mail import Mail, Message
from config import SECRET_KEY, FRONTEND_URL_BASE

mail = Mail()

email_token_serializer = URLSafeTimedSerializer(SECRET_KEY)

bp = Blueprint('auth', __name__, url_prefix='/auth')


class ConfirmEmail(MethodView):
    def post(self):
        email_token = request.get_json()['email_token']
        try:
            email = email_token_serializer.loads(email_token, salt='email-confirm-key', max_age=86400)
        except:
            abort(404)
        
        user = User.query.filter_by(email=email).first_or_404()

        # email token has been verified and user has been found in the database so confirm email by changing to True(1)
        user.email_confirmed = 1

        db.session.add(user)
        db.session.commit()

        return jsonify({
            'message': 'Email successfully verified'
        })
    

class SendPasswordReset(MethodView):
    def post(self):
        email = request.get_json()['email']
        user = User.query.filter_by(email=email).first_or_404()
        token = email_token_serializer.dumps(user.email, salt='reset-key')
        reset_url = '{}reset_password/{}'.format(FRONTEND_URL_BASE, token)
        msg = Message(
            'Habit Tracker Password Reset',
            sender='no-reply@example.com'
        )
        msg.add_recipient(user.email)
        msg.html = 'Hi {}! <br/> Please go to this link to reset your password<a href="{}">{}<a/>'.format(user.username, reset_url, reset_url)
        
        if user.email_confirmed == 1:
            mail.send(msg)
            return jsonify({
                'message': 'Email with reset link has been sent'
            })
        else:
            return jsonify({
                'message': 'Only verified email addresses can be sent password reset links'
            })


class PasswordReset(MethodView):
    def post(self):
        email_token = request.get_json()['email_token']
        new_password = request.get_json()['new_password']
        try:
            email = email_token_serializer.loads(email_token, salt='reset-key', max_age=3600)
        except:
            abort(404)

        user = User.query.filter_by(email=email).first_or_404()
        # check again to make sure email is verified
        # emails are unique so we can be sure this is the right user
        # and the use can only be found if they use the correct token
        # tokens are only valid for an hour and will be blacklisted after use
        if (
            user.email_confirmed == 1 and 
            RevokedResetToken.is_reset_token_blacklisted(email_token) == False):
            # if the email is good and the token hasnt been used before
            # go ahead and change the password
            user.password = User.generate_hash(new_password)
            user.save()
            # then add token to blacklist
            used_reset_token = RevokedResetToken(reset_token=email_token)
            used_reset_token.add()
            return jsonify({
                'message': 'Password has been changed'
            })
        else:
            abort(404)


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

        # use itsdangerous to create a token for confirming email
        email_token = email_token_serializer.dumps(new_user.email, salt='email-confirm-key')
        # User will go to a frontend url and then frontend will use axios to send token to correct endpoint
        confirm_url = '{}confirm_email/{}'.format(FRONTEND_URL_BASE, email_token)

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
bp.add_url_rule('/confirm_email', view_func=ConfirmEmail.as_view('confirm_email'))
bp.add_url_rule('/account_reset', view_func=SendPasswordReset.as_view('account_reset'))
bp.add_url_rule('/password_reset', view_func=PasswordReset.as_view('password_reset'))