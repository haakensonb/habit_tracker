# Build step #1: build the React front end
FROM node:15-alpine as build-step
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY ./package.json ./package.json
COPY ./src ./src
COPY ./public ./public
RUN apk add --no-cache --virtual build-deps \
    g++ gcc libgcc libstdc++ linux-headers make\
    # Old version of node-gyp dependency apparently requires python2
    python2 \
    && npm install node-gyp -g \
    && npm install \
    && npm run build \
    && apk del build-deps

# Build step #2: build Flask backend api using client static files
FROM python:3.9
WORKDIR /app
COPY --from=build-step /app/build ./build

COPY ./habit_tracker ./habit_tracker
COPY ./config.py ./delete_demo_data.sh ./requirements.txt ./wsgi.py ./ 
RUN pip install -r ./requirements.txt
ENV FLASK_APP habit_tracker
ENV FLASK_ENV production

EXPOSE 3000
CMD ["gunicorn", "-b", ":3000", "wsgi:app"]