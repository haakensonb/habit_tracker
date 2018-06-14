# TODO:

Add tests to make sure users can't view/edit/delete other's content

Remove react boilerplate code that isn't needed. Organize components/pages into folders

Add some type of registration confirmation. Maybe use Flask-Mail?


Add function to check if authToken is expired and refresh it. This could be called before any api function to make sure the token is still valid



# Documentation

The goal of this project is to create a habit tracker based on the app 7 weeks.

Backend will be REST api using flask

Frontend will be React

To be continued...

Currently not sure of a better way to get the current_user other than making a query for it every request using the name from the jwt. I could use flask's before_request to load a user into flask's g object but that will fail because it doesn't know the jwt infomation yet.

Tests are kind of slow. Maybe they can be refactored to be faster? Think mocking may be useful for that.