import axios from 'axios';

// this will not use an axiosInstance instead it will just use axios
// because this request will use a refresh token and doesn't need any
// of the axiosInstance config
export default function issueToken(refreshToken) {
  const url = 'http://127.0.0.1:5000/auth/token/refresh';
  const config = {
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    }
  };
  return axios.post(url, config).then((res) => {
    return res.data.access_token;
  });
}