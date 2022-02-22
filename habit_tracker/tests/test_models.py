from habit_tracker.models import (
    Habit, Entry, EntrySchema
    )
from datetime import date, timedelta

from habit_tracker.tests.conftest import UserFactory, EntryFactory, HabitFactory
from habit_tracker.models import User

def test_user_created(client, db):
    user = UserFactory.create()
    assert db.session.query(User).first()

def test_habit_created(client, db):
    habit = HabitFactory.create()
    assert db.session.query(Habit).first()

def test_habit_created_with_entries(client, db):
    habit = HabitFactory.create()
    user = db.session.query(User).get(habit.user_id)
    habit.create_entries(habit.start_date, user)

    assert db.session.query(Habit).first()
    # Correct number of entries are created
    assert len(habit.entries) == 49
    # Entries start out with empty status
    assert all([e.status == '\u00a0' for e in habit.entries])
    # Entries point to the correct habit
    assert all([e.habit_id == habit.id for e in habit.entries])
    # Entries point to the correct user
    assert all([e.user_id == user.id for e in habit.entries])
    # First entry uses starting date
    assert habit.entries[0].entry_day == habit.start_date
    # Last entry uses ending date
    assert habit.entries[-1].entry_day == (habit.start_date + timedelta(days=48))

def test_entry_created(client, db):
    entry = EntryFactory.create()
    assert db.session.query(Entry).first()
