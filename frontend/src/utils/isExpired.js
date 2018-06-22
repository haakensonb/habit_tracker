import jwt_decode from 'jwt-decode';

export default function isExpired(authToken) {
  // if no authToken is provided (such as when logging in)
  // just return false
  if (!authToken){
    return false;
  }
  // need to divide by 1000 because Date.now() returns milliseconds
  // and we need to turn it into seconds to compare with the token expiration
  const currentTime = Date.now() / 1000;
  const decoded = jwt_decode(authToken);
  if (decoded.exp < currentTime) {
    return true;
  } else {
    return false;
  }
}