import * as types from "./actionTypes";

const initialState = {
  internetConnection:true,
  toastText:'',
  toastDuration:3,
  showToast:false
};

export default function common(state = initialState, action = {}) {
  switch (action.type) {
    case types.SET_INTERNET_CONNECTION_STATUS:
      return {
        ...state,
        types:types.SET_INTERNET_CONNECTION_STATUS,
        internetConnection: action.value
      }
    case types.SHOW_TOAST:
      state.showToast = action.showToast
      state.toastText = action.toastText
      state.toastDuration = action.toastDuration

      return {
        ...state,
        types:types.SHOW_TOAST
      }
    default:
      return state;
  }
}
