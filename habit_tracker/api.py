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
            return jsonify(habits_schema.dump(query).data)
            
        # if a habit_id is provided in the url
        elif habit_id:
            # need to add some sort of error handling for when habit_id is out of range
            query = Habit.query.get(habit_id)
            return jsonify(habit_schema.dump(query).data)
    

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
        return jsonify(habit_data)


    def delete(self, habit_id):
        # need error handling for when id doesn't exist
        habit = Habit.query.get(habit_id)
        # only have to delete habit and sqlalchemy will delete
        # it's entries automatically because of a cascade
        db.session.delete(habit)
        db.session.commit()
        return jsonify(habit_schema.dump(habit).data)
    

    # not sure if PUT method is needed yet


    def patch(self, habit_id):
        habit = Habit.query.get(habit_id)
        new_data = habit_schema.load(request.json)
        # there is probably a better way to handle this than just specifiying each input
        name = new_data[0]['name']
        if name:
            habit.name = name
            db.session.commit()

        description = new_data[0]['description']
        if description:
            habit.description = description
            db.session.commit()
        
        # start_date will be implimented later
        # will probably need to parse string into datetime obj 

        updated_habit = Habit.query.get(habit_id)
        return jsonify(habit_schema.dump(updated_habit).data)






# variable to store pluggable view
habits_view = HabitsAPI.as_view('habits')
# add url rule for view to blueprint
bp.add_url_rule('/habits/', view_func=habits_view)
# add url rule for when habit id is provided in url
bp.add_url_rule('/habits/<int:habit_id>', view_func=habits_view)