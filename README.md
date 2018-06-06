# TODO:

Create front-end. Decide if Redux is needed.

Add some type of registration confirmation. Maybe use Flask-Mail?


# Documentation

The goal of this project is to create a habit tracker based on the app 7 weeks.

Backend will be REST api using flask

Frontend will be React

To be continued...

Currently not sure of a better way to get the current_user other than making a query for it every request using the name from the jwt. I could use flask's before_request to load a user into flask's g object but that will fail because it doesn't know the jwt infomation yet.