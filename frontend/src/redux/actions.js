export const LOGIN = 'LOGIN';
export const SEND_LOGIN = 'SEND_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';


export const sendLogin = () => {
  return {
    type: SEND_LOGIN
  }
}


export const receiveLogin = (authToken, refreshToken) => {
  return {
    type: RECEIVE_LOGIN,
    authToken: authToken,
    refreshToken: refreshToken
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
      dispatch(receiveLogin(authToken, refreshToken));
      localStorage.setItem('authToken', authToken);
      localStorage.setItem('refreshToken', refreshToken);
      console.log(res)
    })
  }
}