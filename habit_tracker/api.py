from flask import (
    Blueprint, jsonify, request
)
from habit_tracker.models import (
    Habit, Entry, HabitSchema, EntrySchema, db, 
    habit_schema, habits_schema, entry_schema, entries_schema
)

from flask.views import MethodView
from datetime import datetime, timedelta

# create a blueprint for the api
bp = Blueprint('api', __name__, url_prefix='/api')


class HabitsAPI(MethodView):
    """
    View for all habit related operations in the api
    """

    def get(self, habit_id=None):
        """
        Manages GET request for this view. By default habit_id is None
        unless one is provided.
        """
        # if no habit_id is specified, just return all the habits
        if habit_id is None:
            query = Habit.query.all()
            return habits_schema.jsonify(query)
            
        # if a habit_id is provided in the url
        elif habit_id:
            # need to add some sort of error handling for when habit_id is out of range
            query = Habit.query.get(habit_id)
            return habit_schema.jsonify(query)
    

    def post(self):
        # the start date will just be the current time for now
        # eventually it should be a value specified by the client
        # client will send a string that will be parsed into a datetime obj
        start_date = datetime.now()
        new_data = habit_schema.load(request.json).data
        new_habit = Habit(
            name=new_data['name'],
            description=new_data['description'],
            start_date=start_date
            )
        db.session.add(new_habit)
        # have to commit once here so that Habit exists for Entry to reference later
        db.session.commit()

        create_entries_for_habit(start_date, new_habit, db)

        return habit_schema.jsonify(new_habit)


    def delete(self, habit_id):
        # need error handling for when id doesn't exist
        habit = Habit.query.get(habit_id)
        # only have to delete habit and sqlalchemy will delete
        # it's entries automatically because of a cascade
        db.session.delete(habit)
        db.session.commit()
        return habit_schema.jsonify(habit)
    

    def put(self, habit_id):
        habit = Habit.query.get(habit_id)
        new_data = habit_schema.load(request.json).data
        habit.name = new_data['name']
        habit.description = new_data['description']
        # split at plus sign and take first half because we don't need the other empty timezone part
        habit.start_date = new_data['start_date']
        db.session.commit()
        return habit_schema.jsonify(habit)


def create_entries_for_habit(start_date, new_habit, db):
    # now we need to make the 49 days of entry slots that relates to this habit
    # Think the best way to do this for now is just to use a timedelta and a loop
    # this will probably be moved to seperate file for utils eventually
    delta = timedelta(days=1)
    date = start_date

    for x in range(49):
        entry = Entry(
            entry_day=date,
            status='empty',
            habit_id=new_habit.id
        )
        db.session.add(entry)
        date += delta

    db.session.commit()


class EntryAPI(MethodView):
    """
    View for habits that deal specifically with entries.
    This view may not even be needed.
    """
    # Should only need to see one entry at a time
    # Any case where multiple entries are needed will also require habit
    # info in which case it would be better to call a HabitAPI method
    def get(self, entry_id):
        entry = Entry.query.get(entry_id)
        return entry_schema.jsonify(entry)
    

    def put(self, entry_id):
        entry = Entry.query.get(entry_id)
        new_data = entry_schema.load(request.json).data

        entry.status = new_data['status']
        entry.entry_day = new_data['entry_day']
        db.session.commit()

        return entry_schema.jsonify(entry)


# variable to store pluggable view
habits_view = HabitsAPI.as_view('habits')
# add url rule for view to blueprint
bp.add_url_rule('/habits/', view_func=habits_view)
# add url rule for when habit id is provided in url
bp.add_url_rule('/habits/<int:habit_id>', view_func=habits_view)

entry_view = EntryAPI.as_view('entry')
bp.add_url_rule('/entry/<int:entry_id>', view_func=entry_view)
