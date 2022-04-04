import axios from 'axios';

// this will not use an axiosInstance instead it will just use axios
// because this request will use a refresh token and doesn't need any
// of the axiosInstance config
export default function issueToken(refreshToken) {
  const url = '/auth/token/refresh';
  
  return axios({
    method:'post',
    url: url,
    headers: {
      'Authorization': `Bearer ${refreshToken}`
    }
  }).then((res) => {
    console.log(res)
    return res.data.access_token;
  });
}