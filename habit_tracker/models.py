from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import fields
from flask_bcrypt import Bcrypt
from datetime import timedelta

db = SQLAlchemy()
ma = Marshmallow()
bcrypt = Bcrypt()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)
    # use 0 or 1 as true or false
    email_confirmed = db.Column(db.Integer, default=0)


    def save(self):
        db.session.add(self)
        db.session.commit()


    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username = username).first()
    

    @staticmethod
    def generate_hash(password):
        return bcrypt.generate_password_hash(password).decode('utf-8')
    

    @staticmethod
    def verify_hash(hash, password):
        return bcrypt.check_password_hash(hash, password)


    def __repr__(self):
        return '<User {}>'.format(self.username)


class RevokedToken(db.Model):
    # __tablename__ = 'revoked_tokens'
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(200))


    def add(self):
        db.session.add(self)
        db.session.commit()
    

    @classmethod
    def is_jti_blacklisted(cls, jti):
        query = cls.query.filter_by(jti=jti).first()
        return bool(query)


class Habit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200))
    start_date = db.Column(db.DateTime)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    # cascade is required so that when a habit is deleted it will also
    # remove all the entries associated with it
    # an entry should not exists without a habit
    # for ref see "Configuring delete/delete-orphan Cascade" in sqlalchemy docs
    entries = db.relationship(
        'Entry',
        backref='habit',
        lazy=True,
        cascade='all, delete, delete-orphan')

    def __repr__(self):
        return '<Habit {}>'.format(self.name)
    

    def create_entries(self, start_date, user):
        delta = timedelta(days=1)
        date = start_date

        for x in range(49):
            entry = Entry(
                entry_day=date,
                status='\u00a0',
                habit_id=self.id,
                user_id=user.id
            )
            db.session.add(entry)
            date += delta

        db.session.commit()


class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entry_day = db.Column(db.DateTime)
    # status can be 'empty', 'failed', 'complete'
    # this will be represented by '\u00a0', 'O', 'X' respectively
    status = db.Column(db.String(80))
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    
    def __repr__(self):
        return '<Entry {}'.format(self.status)


class EntrySchema(ma.Schema):
    entry_day = ma.DateTime()
    class Meta:
        fields = (
            'id',
            'entry_day',
            'status',
            'user_id'
        )


class HabitSchema(ma.Schema):
    entries = fields.Nested(EntrySchema, many=True)
    # client sends value as a string so we will leave out this part for now
    # start_date = ma.DateTime()
    class Meta:
        # have to remember to expose the field for entries
        fields = (
            'id',
            'name',
            'description',
            'start_date',
            'entries',
            'user_id'
            )


class UserSchema(ma.Schema):
    class Meta:
        fields  = (
            'id',
            'email',
            'username',
            'password'
        )


habit_schema = HabitSchema()
habits_schema = HabitSchema(many=True)
entry_schema = EntrySchema()
entries_schema = EntrySchema(many=True)
user_schema = UserSchema()
