export const LOGIN = 'LOGIN';
export const SEND_LOGIN = 'SEND_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_AUTH_TOKEN = 'UPDATE_AUTH_TOKEN';


export const sendLogin = () => {
  return {
    type: SEND_LOGIN
  }
}


export const receiveLogin = (authToken, refreshToken, username) => {
  return {
    type: RECEIVE_LOGIN,
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

    // we don't actually have to do anything to handle the return message until
    // we add a flash message system
    fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    })

    fetch(refreshUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
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


export const loginAsync = (username, password) => {
  const url = 'http://127.0.0.1:5000/auth/login';
  const data = {
    username: username,
    password: password
  };

  return (dispatch) => {
    dispatch(sendLogin());
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then( res => res.json())
    .then(res => {
      const authToken = res.access_token;
      const refreshToken = res.refresh_token;
      const username = res.username;
      dispatch(receiveLogin(authToken, refreshToken, username));
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('username', username);
      console.log(res)
    })
  }
}