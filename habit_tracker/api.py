from flask import (
    Blueprint, jsonify, request
)
from habit_tracker.models import (
    Habit, Entry, HabitSchema, EntrySchema, db, habit_schema, entries_schema
)

from flask.views import MethodView
from datetime import datetime, timedelta

# create a blueprint for the api
bp = Blueprint('api', __name__, url_prefix='/api')

# sample data
# for testing before database is configured
habits = [
    {
        'habit_id': 1,
        'habit_name': 'meditation',

    },
    {
        'habit_id': 2,
        'habit_name': 'floss'
    }
]


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
            # have to use jsonify because flask can't just serve a list
            # instances of jsonify will be replaced by marshmallow soon
            # for better serialization
            return jsonify(habits)
        # if a habit_id is provided in the url
        elif habit_id:
            # loop through all the habits
            for habit in habits:
                # check to see if their id matches the one provided
                if habit['habit_id'] == habit_id:
                    # if it matches, return it
                    return jsonify(habit)
            # otherwise no habit with that id was found, send error message
            return "That habit doesn't exist"
    

    def post(self):
        # the start date will just be the current time for now
        # eventually it should be a value specified by the client
        # client will send a string that will be parsed into a datetime obj
        start_date = datetime.now()
        new_habit = Habit(
            name=request.json['name'],
            description=request.json['description'],
            start_date=start_date
            )
        db.session.add(new_habit)
        # have to commit once here so that Habit exists for Entry to reference later
        db.session.commit()

        # now we need to make the 49 days of entry slots that relates to this habit
        # Think the best way to do this for now is just to use a timedelta and a loop
        # this should probably end up in it's own function eventually
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

        # commit again to create entries
        db.session.commit()

        # calling data at the end gets rid of empty object at the end
        # use schema to turn new habit into json
        habit_data = habit_schema.dump(new_habit).data

        # calling .data at the end gets rid of the unneeded list around entries
        # use schema to turn all entries for this habit into json
        # get entries by searching for ones that have a foreign key corresponding to the new habit
        entries_data = entries_schema.dump(Entry.query.filter(Entry.habit_id == new_habit.id).all()).data
        return jsonify({'habit': habit_data, 'entries': entries_data})


    def delete(self, habit_id):
        # this is sloppy but this is just for testing
        # once database is used this will look different
        global habits
        # find habit that matches id
        deleted_habit = None
        for habit in habits:
            if habit['habit_id'] == habit_id:
                deleted_habit = habit
                break

        # set habits equal to filter that excludes old habit
        habits = [x for x in habits if x['habit_id'] != habit_id]
        # return the habit that is deleted
        return jsonify(deleted_habit)
    

    def put(self, user_id):
        pass
        







# variable to store pluggable view
habits_view = HabitsAPI.as_view('habits')
# add url rule for view to blueprint
bp.add_url_rule('/habits/', view_func=habits_view)
# add url rule for when habit id is provided in url
bp.add_url_rule('/habits/<int:habit_id>', view_func=habits_view)