import axiosInstance from '../utils/axiosInstance';
import axios from 'axios';
import { showMessage } from "../utils/showMessage";

export const SEND_DATA = 'SEND_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const LOGOUT = 'LOGOUT';
export const UPDATE_AUTH_TOKEN = 'UPDATE_AUTH_TOKEN';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';


export const sendData = () => {
  return {
    type: SEND_DATA
  }
}


export const receiveData = (authToken, refreshToken, username) => {
  return {
    type: RECEIVE_DATA,
    authToken: authToken,
    refreshToken: refreshToken,
    username: username
  }
}


export const logoutUser = () => {
  return {
    type: LOGOUT
  }
}


export const logoutUserFromApi = (authToken, refreshToken) => {
  return (dispatch) => {
    const authUrl = 'http://127.0.0.1:5000/auth/logout/access';
    const refreshUrl = 'http://127.0.0.1:5000/auth/logout/refresh';
    // have to make two seperate api calls here
    // one to logout the auth token and one for the refresh token

    let authPromise = axios({
      method: 'post',
      url: authUrl,
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })

    let refreshPromise = axios({
      method: 'post',
      url: refreshUrl,
      headers: {
        'Authorization': `Bearer ${refreshToken}`
      }
    })

    return Promise.all([authPromise, refreshPromise])
      .then(() => {
        dispatch(addMessage('Successfully logged out', 'success'));
        showMessage();
      })
      .catch(() => {
        dispatch(addMessage('Either you were already logged out or something went wrong', 'error'));
        showMessage();
      })

  }
}


export const updateAuthToken = (authToken) => {
  return {
    type: UPDATE_AUTH_TOKEN,
    authToken: authToken
  }
}


export const setAuthData = (url, username, password) => {
  const data = {
    username: username,
    password: password
  };

  return (dispatch) => {
    dispatch(sendData());
    axiosInstance.post(url, data).then(res => {
      const message = res.data.message;
      if (message) {
        dispatch(logoutUser());
        dispatch(addMessage(message, 'error'));
        showMessage();
      } else {
        const authToken = res.data.access_token;
        const refreshToken = res.data.refresh_token;
        const username = res.data.username;
        dispatch(receiveData(authToken, refreshToken, username));
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('username', username);
        dispatch(addMessage(`Hi ${username}!`, 'success'))
        showMessage();
      }
      
    })
    .catch((err) => {
      // need to reset isFetching by logging out if something goes wrong
      dispatch(logoutUser());
      dispatch(addMessage('Make sure your credentials are correct. If you are attempting to register your username may already be taken', 'error'))
      showMessage();
    })
  }
}

// this is like setAuthData but should only be used for registering
// the distinctions between the are not really clear and should be refactored/renamed in the future
export const setAuthDataRegistration = (url, username, password) => {
  const data = {
    username: username,
    password: password
  };

  return (dispatch) => {
    dispatch(sendData());
    axiosInstance.post(url, data).then(res => {
      const message = res.data.message;
      dispatch(logoutUser());
      dispatch(addMessage(message, 'success'))
      showMessage();
    })
    .catch((err) => {
      // need to reset isFetching by logging out if something goes wrong
      dispatch(logoutUser());
      dispatch(addMessage('Make sure your credentials are correct. If you are attempting to register your username may already be taken', 'error'))
      showMessage();
    })
  }
}


export const addMessage = (message, messageType) => {
  return {
    type: ADD_MESSAGE,
    message: message,
    messageType: messageType
  }
}

export const clearMessage = () => {
  return {
    type: CLEAR_MESSAGE
  }
}

