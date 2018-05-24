from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from marshmallow import fields

db = SQLAlchemy()
ma = Marshmallow()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), unique=True, nullable=False)

    def __repr__(self):
        return '<User {}>'.format(self.username)


class Habit(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(200))
    start_date = db.Column(db.DateTime)
    entries = db.relationship('Entry', backref='habit', lazy=True)

    def __repr__(self):
        return '<Habit {}>'.format(self.name)


class Entry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    entry_day = db.Column(db.DateTime)
    # status can be 'empty', 'failed', 'complete'
    status = db.Column(db.String(80))
    habit_id = db.Column(db.Integer, db.ForeignKey('habit.id'), nullable=False)
    
    def __repr__(self):
        return '<Entry {}'.format(self.status)


class EntrySchema(ma.Schema):
    class Meta:
        fields = (
            'id',
            'entry_day',
            'status'
        )


class HabitSchema(ma.Schema):
    entries = fields.Nested(EntrySchema, many=True)
    class Meta:
        # have to remember to expose the field for entries
        fields = (
            'id',
            'name',
            'description',
            'start_date',
            'entries'
            )


habit_schema = HabitSchema()
habits_schema = HabitSchema(many=True)
entry_schema = EntrySchema()
entries_schema = EntrySchema(many=True)
