import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { rootReducer } from './redux/reducers'
import thunk from 'redux-thunk'
import { receiveData, updateAuthToken } from './redux/actions';
import isExpired from './utils/isExpired';
import axios from 'axios';
import issueToken from './utils/issueToken';

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
  store.dispatch(receiveData(authToken, refreshToken, username))

  // need also to check if token has already expired on load
  // if user refreshes the page the setInterval will restart
  // so the token will end up expired before it counts to 14 and a half minutes
  if (isExpired(authToken)){
    issueToken().then((newAuthToken) => {
      store.dispatch(updateAuthToken(newAuthToken))
    })
  }
}


// axios will run this before every request to make sure that the authToken is not expired
axios.interceptors.request.use((config) => {
  let originalRequest = config;
  const loginUrl = 'http://127.0.0.1:5000/auth/login';
  const authToken = store.getState().authReducer.authToken;

  // if the token is expired and we are not trying to login
  if (isExpired(authToken) && config.url !== loginUrl) {
    // then issueToken will return a new auth token
    return issueToken().then((newAuthToken) => {
      // the old request has it's authToken replaced with the new one
      originalRequest['Authorization'] = `Bearer ${newAuthToken}`
      // also add this updated token to the redux store
      store.dispatch(updateAuthToken(newAuthToken));
      // then send the request on it's way with the updated token
      return Promise.resolve(originalRequest);
    });
  }
  // if the authToken isn't expired we don't have to do anything
  return config;
}, (err) => {
  return Promise.reject(err);
})


ReactDOM.render(
  // wrap entire app in provider and pass in redux's store
  // so that all components can access to redux state
  <Provider store={store}>
    <App />
  </Provider>
  ,
  document.getElementById('root'));
registerServiceWorker();
