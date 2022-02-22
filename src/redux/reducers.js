import { combineReducers } from "redux";
import { SEND_DATA, RECEIVE_DATA, LOGOUT, UPDATE_AUTH_TOKEN, ADD_MESSAGE, CLEAR_MESSAGE } from "./actions";

const defaultState = {
  isFetching: false,
  authToken: '',
  refreshToken: '',
  isAuthenticated: false,
  username: ''
}

const authReducer = (state = defaultState, action) => {
  switch (action.type) {
    case SEND_DATA:
      return {
        isFetching: true,
        authToken: '',
        refreshToken: '',
        isAuthenticated: false,
        username: ''
      }
    case RECEIVE_DATA:
      return {
        isFetching: false,
        authToken: action.authToken,
        refreshToken: action.refreshToken,
        isAuthenticated: true,
        username: action.username
      }
    case LOGOUT:
      return {
        isFetching: false,
        authToken: '',
        refreshToken: '',
        isAuthenticated: false,
        username: ''
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

const defaultMessageState = {
  message: '',
  messageType: ''
}

const messageReducer = (state = defaultMessageState, action) => {
  switch(action.type){
    case ADD_MESSAGE:
      return {
        message: action.message,
        messageType: action.messageType
      }
    case CLEAR_MESSAGE:
      return {
        message: '',
        messageType: ''
      }
    default:
      return state;
  }
}

export const rootReducer = combineReducers({
  authReducer,
  messageReducer
})