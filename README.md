



# Habit Tracker

---

The goal of this project is to create a habit tracker based on the app 7 weeks. This app is inspired by [the X effect subreddit](https://www.reddit.com/r/theXeffect/).



The basic idea of the X effect for habit building is that a person should mark a large X on their calendar for everyday that they do at least a little bit of a habit. This provides visual reinforcement and also encourages the person not a break a consecutive streak. The idea being that after 7 weeks of doing this a person will have solidified a good habit.

---

 ### Demo

Try out the habit tracker at

Username: DemoAccount

Password: habitTester123

**Demo account data is cleared daily. If you want your data to persist you must register your own account.**

---

### Backend

The backend of this project is an API made with Flask. Unit tests for the backend are not exhaustive but can be found in the tests folder.

**Overview of backend files in habit_tracker folder**

* init: This file is mostly just flask specific setup for registering blueprints and changing extension settings.
* api: The classes in this file use Flask's methodview to create endpoints for the core functionality of the api. These endpoints are for creating and altering habits/habit entries.
* auth: This file is setup in the same manner as api but it only contains endpoints dealing with authenticating a user. This includes all user related endpoints such as registering, logging in and logging out. This file also contains endpoints for confirming email addresses and resetting passwords.
* models: This file contains the models for sqlalchemy to setup tables as well flask-marshmallow schema for serializing. 


---

### Frontend

The frontent of this project was made using React and Redux.

---

### Requirements

Full list of Python requirements can be found in ```requirements.txt```

React also has a list of npm dependencies in ```package.json```

---

### How to run this project locally

1. Setup virtual environment and install Python requirements

   ```
   python -m venv env
   source env/bin/activate
   pip install -r requirements.txt
   ```

2. Configure Flask

   ```
   export FLASK_APP=habit_tracker
   export FLASK_ENV=development
   ```

3. Edit ```example_config.py``` so that it contains the username and password for an smtp mail server such as mailtrap. Also generate a secret key:

   ```
   python
   >>> import os
   >>> os.urandom(24)
   ```

   Use the output of this as the secret key. Then rename ```example_config.py``` to ```config.py```.

4. Create database

   ```
   flask shell
   >>> from habit_tracker.models import db
   >>> db.create_all()
   >>> quit()
   ```

4. Start Flask server

   ```
   flask run
   ```

5. Install npm requirements

   ```
   cd frontend
   npm install
   ```

6. Start React on frontend

   ```
   npm start
   ```

7. Go to link specified in output of npm start. Make sure that the variable ```FRONTEND_URL_BASE``` in ```config.py``` is set to the same URL that npm starts React on.

# TODO:

  

Add tests for frontend

  

Refactor init

  

Refactor message system. Send message type from api along with message

  

Tests are kind of slow. Maybe they can be refactored to be faster? Think mocking may be useful for that.