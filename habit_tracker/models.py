from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import fields
from passlib.hash import pbkdf2_sha256 as sha256
from datetime import timedelta

db = SQLAlchemy()
ma = Marshmallow()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)


    def save(self):
        db.session.add(self)
        db.session.commit()


    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username = username).first()
    

    @staticmethod
    def generate_hash(password):
        return sha256.hash(password)
    

    @staticmethod
    def verify_hash(password, hash):
        return sha256.verify(password, hash)


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
    

    def create_entries(self, start_date):
        delta = timedelta(days=1)
        date = start_date

        for x in range(49):
            entry = Entry(
                entry_day=date,
                status='empty',
                habit_id=self.id
            )
            db.session.add(entry)
            date += delta

        db.session.commit()


class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entry_day = db.Column(db.DateTime)
    # status can be 'empty', 'failed', 'complete'
    status = db.Column(db.String(80))
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'), nullable=False)
    
    def __repr__(self):
        return '<Entry {}'.format(self.status)


class EntrySchema(ma.Schema):
    entry_day = ma.DateTime()
    class Meta:
        fields = (
            'id',
            'entry_day',
            'status'
        )


class HabitSchema(ma.Schema):
    entries = fields.Nested(EntrySchema, many=True)
    start_date = ma.DateTime()
    class Meta:
        # have to remember to expose the field for entries
        fields = (
            'id',
            'name',
            'description',
            'start_date',
            'entries'
            )


class UserSchema(ma.Schema):
    class Meta:
        fields  = (
            'id',
            'username',
            'password'
        )


habit_schema = HabitSchema()
habits_schema = HabitSchema(many=True)
entry_schema = EntrySchema()
entries_schema = EntrySchema(many=True)
user_schema = UserSchema()
