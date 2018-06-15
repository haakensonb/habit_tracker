import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { rootReducer } from './redux/reducers'
import thunk from 'redux-thunk'
import { receiveLogin, useRefreshToUpdateAuth } from './redux/actions';

export const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
  );

// check to see if tokens are already in the localStorage
const authToken = localStorage.getItem('authToken');
const refreshToken = localStorage.getItem('refreshToken');
const username = localStorage.getItem('username');
// If they are we need to place them in the store.
// This makes sure that the user will stay logged in if they refresh the page
if (authToken && refreshToken && username) {
  store.dispatch(receiveLogin(authToken, refreshToken, username))
}

// authTokens expire every 15 minutes
// so every 14 and a half minutes (870000 milliseconds)
// dispatch an action creator to get a refreshed token.
// This function is called 30 seconds before expiration so that there is plenty of time
// for the server to process the request and respond with the new token.
// This way the user (probably) won't be caught in a state where there is an error
// because they have an expired token and are waiting for a new one
setInterval(
  () => {
    const currState = store.getState();
    // console.log(currState)
    const refreshToken = currState.loginReducer.refreshToken;
    const isAuthenticated = currState.loginReducer.isAuthenticated;
    // check first to make sure that there is a refresh token
    // and that the user is logged in, so that this doesn't
    // run and fail on unathenticated pages (like the homepage)
    if (refreshToken && isAuthenticated) {
      store.dispatch(useRefreshToUpdateAuth(refreshToken))
    }
  }, 870000);

ReactDOM.render(
  // wrap entire app in provider and pass in redux's store
  // so that all components can access to redux state
  <Provider store={store}>
    <App />
  </Provider>
  ,
  document.getElementById('root'));
registerServiceWorker();
