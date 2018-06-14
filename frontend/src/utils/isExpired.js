import jwt_decode from 'jwt-decode';

export const isExpired = (authToken) => {
  let dateNow = new Date();
  // token is expired if the current time is greater than the expiration
  // if token is expired return true
  // console.log(dateNow.getTime())
  let decoded = jwt_decode(authToken);
  // console.log(decoded)
  if (decoded.exp < dateNow.getTime()) {
    return true;
  } else {
    return false;
  }
}