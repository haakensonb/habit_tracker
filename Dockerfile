# This version combines the frontend/backend into one container which isn't ideal
# but it allows for easy hosting with services such as Heroku.
# Commands to build and run:
# docker build -f Dockerfile -t habit-tracker-combo --build-arg REACT_APP_PORT=3000 .
# docker run --rm -p 3000:3000 habit-tracker-combo

# Build step #1: build the React front end
FROM node:14 as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
ARG REACT_APP_PORT
ENV REACT_APP_PORT $REACT_APP_PORT
COPY ./package.json ./package.json
COPY ./src ./src
COPY ./public ./public
RUN npm install
RUN npm run build

# Build step #2: build Flask backend api using client static files
FROM python:3.9
WORKDIR /app
COPY --from=build-step /app/build ./build

COPY ./habit_tracker ./habit_tracker
COPY ./config.py ./requirements.txt ./wsgi.py ./ 
RUN pip install -r ./requirements.txt

ENV FLASK_APP habit_tracker
ENV FLASK_ENV production

EXPOSE 3000
CMD ["gunicorn", "-b", ":3000", "wsgi:app"]