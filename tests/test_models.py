from habit_tracker.models import (
    db, Habit, Entry, EntrySchema
    )
import datetime


def test_habit_created(app):
    with app.app_context():
        habit = Habit.query.get(1)
        assert habit
        assert habit.id == 1
        assert habit.name == 'test'
        assert habit.description == 'this is a test'
        assert isinstance(habit.start_date, datetime.date)
        

def test_habit_doesnt_exist(app):
    with app.app_context():
        habit = Habit.query.get(5)
        assert not habit


def test_entry_created(app):
    with app.app_context():
        entry = Entry.query.get(1)
        assert entry
        assert entry.id == 1
        assert isinstance(entry.entry_day, datetime.date)
        assert entry.status == 'empty'
        assert entry.habit_id == 1


def test_entry_doesnt_exist(app):
    with app.app_context():
        entry = Entry.query.get(50)
        assert not entry


