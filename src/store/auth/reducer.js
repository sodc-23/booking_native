import * as types from "./actionTypes";

const initialState = {
  currentUser: null,
  isLoggedIn: false,
  type: types.NONE,
  status: types.NONE,
  result: null,
  error: null,
  needBack:null,
};

export default function common(state = initialState, action = {}) {
  switch (action.type) {
    case types.AUTH_LOGIN:
      if (action.result) {
        state.currentUser = action.result
      }
      return {
        ...state,
        type: types.AUTH_LOGIN,
        status: action.status,
        isLoggedIn: action.status == types.SUCCESS,
        result: action.result,
        error: action.error,
      }
    case types.AUTH_LOGOUT:
      state.currentUser = null
      return {
        ...state,
        type: types.AUTH_LOGOUT,
        status: types.NONE,
        isLoggedIn: false,
      }
    case types.AUTH_REGISTER:
      if (action.result) {
        state.currentUser = action.result
      }
      return {
        ...state,
        type: types.AUTH_REGISTER,
        status: action.status,
        isLoggedIn: action.status == types.SUCCESS,
        result: action.result,
        error: action.error,
      }
    case types.AUTH_FORGOT:
      return {
        ...state,
        type: types.AUTH_FORGOT,
        status: action.status,
        result: action.result,
        error: action.error,
      }
    case types.AUTH_USER:
      if (action.result) {
        state.currentUser = action.result
      }
      return {
        ...state,
        type: types.AUTH_USER,
        isLoggedIn: true
      }
    case types.AUTH_USER_PROFILE:
      if (action.result) {
        state.currentUser = action.result
      }
      return {
        ...state,
        type: types.AUTH_USER_PROFILE
      }
    case types.AUTH_NEED_BACK:
      return{
        ...state,
        type:types.AUTH_NEED_BACK,
        needBack: action.value
      }
    default:
      return state;
  }
}
