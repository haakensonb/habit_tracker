import {UPDATE_AUTH_TOKEN} from "./actionConsts";

export const updateAuthToken = (authToken) => {
  return {
    type: UPDATE_AUTH_TOKEN,
    authToken: authToken
  }
}