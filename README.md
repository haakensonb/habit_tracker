# Habit Tracker

---

The goal of this project is to create a habit tracker based on the app 7 weeks. This app is inspired by [the X effect subreddit](https://www.reddit.com/r/theXeffect/).



The basic idea of the X effect for habit building is that a person should mark a large X on their calendar for everyday that they do at least a little bit of a habit. This provides visual reinforcement and also encourages the person not a break a consecutive streak. The idea being that after 7 weeks of doing this a person will have solidified a good habit.

---

## Demo

Try out the habit tracker [here](https://www.projects.brandonhaakenson.com/)

Username: DemoAccount

Password: habitTester123

**If you want your data to persist you must register your own account.**

---

## Running Project Locally

Requires docker to be installed.

**Option 1:**


Build and run using a single container (useful for deploying to places like Heroku)
```
docker build -f Dockerfile -t habit-tracker-combo --build-arg REACT_APP_PORT=3000 .

docker run --rm -p 3000:3000 habit-tracker-combo
```
Then navigate to `http://localhost:3000/`

**Option 2:**


Use separate containers for frontend and backend
```
docker-compose up --build
```
Then navigate to `http://localhost:3000/`

## Running Tests

```
# Build the container
docker build -f Dockerfile -t habit-tracker-combo --build-arg REACT_APP_PORT=3000 .

# Running tests in the container
docker run habit-tracker-combo sh -c "python3 -m pytest"
```
---
## Troubleshooting
If you are using Docker with WSL2 you may run into a networking bug that causes a CORs error while trying to login.

In this case, try restarting WSL2 using `wsl --shutdown` in the command prompt. Restart Docker when prompted and then try to build the container again.

---


## Backend

The backend of this project is an API made with Flask. Unit tests for the backend are not exhaustive but can be found in the tests folder.

**Overview of backend files in habit_tracker folder**

* init: This file is mostly just flask specific setup for registering blueprints and changing extension settings.
* api: The classes in this file use Flask's methodview to create endpoints for the core functionality of the api. These endpoints are for creating and altering habits/habit entries.
* auth: This file is setup in the same manner as api but it only contains endpoints dealing with authenticating a user. This includes all user related endpoints such as registering, logging in and logging out. This file also contains endpoints for confirming email addresses and resetting passwords.
* models: This file contains the models for sqlalchemy to setup tables as well flask-marshmallow schema for serializing. 


---

## Frontend

The frontent of this project was made using React and Redux.

