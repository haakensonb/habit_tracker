import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import { receiveData, updateAuthToken } from './redux/actions';
import isExpired from './utils/isExpired';
import issueToken from './utils/issueToken';
import { store } from './redux/store';



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
    issueToken(refreshToken).then((newAuthToken) => {
      store.dispatch(updateAuthToken(newAuthToken))
    })
  }
}


ReactDOM.render(
  // wrap entire app in provider and pass in redux's store
  // so that all components can access to redux state
  <Provider store={store}>
    <App />
  </Provider>
  ,
  document.getElementById('root'));
registerServiceWorker();
