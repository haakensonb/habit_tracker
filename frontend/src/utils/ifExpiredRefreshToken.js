import { isExpired } from "./isExpired";
import {store} from '../index'
import { receiveLogin } from "../redux/actions";

// pass in an authToken and this function will refresh an expired token
// returns a promise so that it can be sure token is updated before any more api calls
export const ifExpiredRefreshToken = async (authToken) => {
  if (isExpired(authToken)) {
    let currState = store.getState();
    // console.log(currState);
    // console.log(currState.loginReducer.refreshToken)
    let refreshToken = currState.loginReducer.refreshToken;
    let url = 'http://127.0.0.1:5000/auth/token/refresh';
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${refreshToken}`
      }
    })
    .then(res => res.json())
    .then((data) => {
      // needs real action but am using this for now
      store.dispatch(receiveLogin(data.access_token, refreshToken))
      localStorage.setItem('authToken', data.access_token)
    })
  }
}