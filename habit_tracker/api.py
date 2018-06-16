from flask import (
    Blueprint, jsonify, request
)
from habit_tracker.models import (
    Habit, Entry, HabitSchema, EntrySchema, db, 
    habit_schema, habits_schema, entry_schema, entries_schema,
    User
)
from flask_jwt_extended import (
    get_jwt_identity, jwt_required
)

from flask.views import MethodView
from datetime import datetime, timedelta

# create a blueprint for the api
bp = Blueprint('api', __name__, url_prefix='/api')


class HabitsAPI(MethodView):
    """
    View for all habit related operations in the api
    """

    @jwt_required
    def get(self, habit_id=None):
        """
        Manages GET request for this view. By default habit_id is None
        unless one is provided.
        """
        current_user = User.find_by_username(get_jwt_identity())
        # if no habit_id is specified, just return all the habits
        if habit_id is None:
            query = Habit.query.filter(Habit.user_id == current_user.id).all()
            return habits_schema.jsonify(query)
            
        # if a habit_id is provided in the url
        elif habit_id:
            # need to add some sort of error handling for when habit_id is out of range
            query = Habit.query.get(habit_id)
            if query is None:
                return jsonify({'message': 'Habit does not exist'})
            elif query.user_id == current_user.id:
                return habit_schema.jsonify(query)
            else:
                return jsonify({'message': 'That\'s not yours!'})
    

    @jwt_required
    def post(self):
        current_user = User.find_by_username(get_jwt_identity())
        new_data = habit_schema.load(request.json).data
        # i don't know why habit_schema sometimes doesn't load the date
        # so lets just load it from the request for now
        start_date = request.json['start_date']
        start_date = datetime.strptime(start_date, '%m/%d/%Y')
        new_habit = Habit(
            name=new_data['name'],
            description=new_data['description'],
            start_date=start_date,
            user_id = current_user.id
            )
        db.session.add(new_habit)
        # have to commit once here so that Habit exists for Entry to reference later
        db.session.commit()

        new_habit.create_entries(start_date, current_user)

        return habit_schema.jsonify(new_habit)


    @jwt_required
    def delete(self, habit_id):
        current_user = User.find_by_username(get_jwt_identity())
        # need error handling for when id doesn't exist
        habit = Habit.query.get(habit_id)
        if habit.user_id == current_user.id:
            # only have to delete habit and sqlalchemy will delete
            # it's entries automatically because of a cascade
            db.session.delete(habit)
            db.session.commit()
        else:
            return jsonify({'message': 'That\'s not yours to delete!'})

        return habit_schema.jsonify(habit)
    

    @jwt_required
    def put(self, habit_id):
        current_user = User.find_by_username(get_jwt_identity())
        habit = Habit.query.get(habit_id)
        if habit.user_id == current_user.id:
            new_data = habit_schema.load(request.json).data
            habit.name = new_data['name']
            habit.description = new_data['description']
            # probably shouldn't be able to edit the start date
            # habit.start_date = new_data['start_date']
            db.session.commit()
        else:
            return jsonify({'message': 'That\'s not yours to change!'})

        return habit_schema.jsonify(habit)


class EntryAPI(MethodView):
    """
    View for habits that deal specifically with entries.
    This view may not even be needed.
    """
    # Should only need to see one entry at a time
    # Any case where multiple entries are needed will also require habit
    # info in which case it would be better to call a HabitAPI method
    @jwt_required
    def get(self, entry_id):
        current_user = User.find_by_username(get_jwt_identity())
        entry = Entry.query.get(entry_id)
        if entry.user_id == current_user.id:
            return entry_schema.jsonify(entry)
        else:
            return jsonify({'message': 'That\'s not yours!'})
    

    @jwt_required
    def put(self, entry_id):
        current_user = User.find_by_username(get_jwt_identity())
        entry = Entry.query.get(entry_id)
        if entry.user_id == current_user.id:
            new_data = entry_schema.load(request.json).data
            entry.status = new_data['status']
            entry.entry_day = new_data['entry_day']
            db.session.commit()
            return entry_schema.jsonify(entry)
        else:
            return jsonify({'message': 'That\'s not yours to change!'})


# variable to store pluggable view
habits_view = HabitsAPI.as_view('habits')
# add url rule for view to blueprint
bp.add_url_rule('/habits/', view_func=habits_view)
# add url rule for when habit id is provided in url
bp.add_url_rule('/habits/<int:habit_id>', view_func=habits_view)

entry_view = EntryAPI.as_view('entry')
bp.add_url_rule('/entry/<int:entry_id>', view_func=entry_view)
