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
          toast.error("Either you were already logged out or something went wrong")
        }
      })
      .catch(() => {
        toast.error("Either you were already logged out or something went wrong")
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
    .then(res => {
      // if the response isn't ok throw an error
      if (!res.ok) {
        throw Error()
      }
      return res.json();
    })
    .then(data => {
      dispatch(updateAuthToken(data.access_token));
    })
    .catch(() => {
      // dispatch logout to make sure user is not authenticated
      dispatch(logoutUser());
      toast.error("Not able to stay logged in. Try logging out and logging in again.");
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
    .then( res => {
      if (!res.ok){
        throw Error(res.status);
      }
      return res.json();
    })
    .then(data => {
      const authToken = data.access_token;
      const refreshToken = data.refresh_token;
      const username = data.username;
      dispatch(receiveData(authToken, refreshToken, username));
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      toast.success(`Hi ${data.username}!`)
    })
    .catch((error) => {
      // user failed to login so make sure then are logged out and not authenticated
      dispatch(logoutUser());
      toast.error("Something went wrong");
    })
  }
}
