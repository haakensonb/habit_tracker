import axios from 'axios';
import isExpired from './isExpired';
import issueToken from './issueToken';
import { updateAuthToken } from '../redux/actions';
import { store } from '../redux/store';
import { toast } from 'react-toastify';
import baseURL from './baseURL';

// create an instance of axios so that global settings can be changed
// and persist across multiple pages
var axiosInstance = axios.create();

// axios will run this before every request to make sure that the authToken is not expired
axiosInstance.interceptors.request.use((config) => {
  let originalRequest = config;
  const loginUrl = `${baseURL}/auth/login`;
  const refreshToken = store.getState().authReducer.refreshToken;
  const authToken = store.getState().authReducer.authToken;

  // if the token is expired and we are not trying to login
  if (isExpired(authToken) && config.url !== loginUrl) {
    // then issueToken will return a new auth token
    return issueToken(refreshToken).then((newAuthToken) => {
      // the old request has it's authToken replaced with the new one
      originalRequest.headers = {
        'Authorization': `Bearer ${newAuthToken}`,
        'Content-Type': 'application/json'
      }
      // also add this updated token to the redux store
      store.dispatch(updateAuthToken(newAuthToken));
      console.log(originalRequest)
      // then send the request on it's way with the updated token
      return Promise.resolve(originalRequest);
    });
  }
  // the token isn't expired but we still need to add the proper headers
  config.headers = {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  }
  return config;
}, (err) => {
  return Promise.reject(err);
})

// anytime the server sends a response that isn't ok
// just show a generic error for the user
axiosInstance.interceptors.response.use((response) => {
  return response;
}, (err) => {
  toast.error('Something went wrong')
  return Promise.reject(err);
})

export default axiosInstance;