#!/bin/bash
echo "Clearing data from Habit Tracker DemoAccount..."
export FLASK_APP=habit_tracker
# open up the python shell for flask and send it some commands
# I don't think cascading delete works on bulk deletion in flask shell without extra db config
# so just make sure to explicitly delete entries as well
flask shell <<END
from habit_tracker.models import db, User, Habit, Entry
demo = User.query.get(1)
Habit.query.filter_by(user_id=demo.id).delete()
Entry.query.filter_by(user_id=demo.id).delete()
db.session.commit()
quit()
END
echo "DemoAccount data cleared"