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
if (authToken && refreshToken) {
  store.dispatch(receiveLogin(authToken, refreshToken))
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  ,
  document.getElementById('root'));
registerServiceWorker();
