import { combineReducers } from "redux";
import { SEND_LOGIN, RECEIVE_LOGIN } from "./actions";

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
    default:
      return state;

  }
}

export const rootReducer = combineReducers({
  loginReducer
})