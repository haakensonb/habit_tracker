import React from 'react';
import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import './styles.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux'
import { receiveData } from './redux/actions';
import { store } from './redux/store';


// check to see if tokens are already in the localStorage
const authToken = localStorage.getItem('authToken');
const refreshToken = localStorage.getItem('refreshToken');
const username = localStorage.getItem('username');
// If they are we need to place them in the store.
// This makes sure that the user will stay logged in if they refresh the page
if (authToken && refreshToken && username) {
  store.dispatch(receiveData(authToken, refreshToken, username))
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
