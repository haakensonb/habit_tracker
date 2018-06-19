import { toast } from "react-toastify";

export const SEND_DATA = 'SEND_DATA';
export const RECEIVE_DATA = 'RECEIVE_DATA';
export const LOGOUT = 'LOGOUT';
export const UPDATE_AUTH_TOKEN = 'UPDATE_AUTH_TOKEN';


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

    let authPromise = fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    let refreshPromise = fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    });

    return Promise.all([authPromise, refreshPromise])
      .then((res) => {
        if (res.ok){
          toast.success("Successfully logged out")
        } else {
          toast.error("Something went wrong")
        }
      })
      .catch(() => {
        toast.error("Something went wrong. You may not have been logged out properly.")
      })

  }
}


export const updateAuthToken = (authToken) => {
  return {
    type: UPDATE_AUTH_TOKEN,
    authToken: authToken
  }
}


export const useRefreshToUpdateAuth = (refreshToken) => {
  const url = 'http://127.0.0.1:5000/auth/token/refresh';

  return (dispatch) => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    })
    .then(res => res.json())
    .then(data => {
      dispatch(updateAuthToken(data.access_token));
      // make sure token actually came back before assigning
      // so that authToken isn't accidentally set to undefined
      // this should probably be made more robust in the future
      if (data.access_token !== undefined){
        localStorage.setItem('authToken', data.access_token);
      }
      // console.log(data);
    })
  }
}


export const setAuthData = (url, username, password) => {
  const data = {
    username: username,
    password: password
  };

  return (dispatch) => {
    dispatch(sendData());
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then( res => res.json())
    .then(data => {
      const authToken = data.access_token;
      const refreshToken = data.refresh_token;
      const username = data.username;
      dispatch(receiveData(authToken, refreshToken, username));
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      toast.success(`Hi ${data.username}!`)
      console.log(data);
    })
  }
}
