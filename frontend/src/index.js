import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { rootReducer } from './redux/reducers'
import thunk from 'redux-thunk'
import { receiveLogin } from './redux/actions';

const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
  );

// check to see if tokens are already in the localStorage
const authToken = localStorage.getItem('authToken');
const refreshToken = localStorage.getItem('refreshToken');
// If they are we need to place them in the store.
// This makes sure that the user will stay logged in if they refresh the page
if (authToken && refreshToken) {
  store.dispatch(receiveLogin(authToken, refreshToken))
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
