from flask import (
    Blueprint, jsonify
)

from flask.views import MethodView

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

# variable to store pluggable view
habits_view = HabitsAPI.as_view('habits')
# add url rule for view to blueprint
bp.add_url_rule('/habits/', view_func=habits_view)
# add url rule for when habit id is provided in url
bp.add_url_rule('/habits/<int:habit_id>', view_func=habits_view)