import { combineReducers } from "redux";
import { SEND_LOGIN, RECEIVE_LOGIN, LOGOUT, UPDATE_AUTH_TOKEN } from "./actions";

const defaultState = {
  isFetching: false,
  authToken: '',
  refreshToken: '',
  isAuthenticated: false
}

const loginReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SEND_LOGIN:
      return {
        isFetching: true,
        authToken: '',
        refreshToken: '',
        isAuthenticated: false
      }
    case RECEIVE_LOGIN:
      return {
        isFetching: false,
        authToken: action.authToken,
        refreshToken: action.refreshToken,
        isAuthenticated: true
      }
    case LOGOUT:
      return {
        isFetching: false,
        authToken: '',
        refreshToken: '',
        isAuthenticated: false
      }
    case UPDATE_AUTH_TOKEN:
      return (Object.assign(
        {},
        state,
        {authToken: action.authToken}
      ))
    default:
      return state;

  }
}

export const rootReducer = combineReducers({
  loginReducer
})