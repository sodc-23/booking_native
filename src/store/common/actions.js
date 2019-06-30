import * as types from './actionTypes';
import api from '@services'

export function setInternetConnection(status) {
  return dispatch => {
    dispatch({ type: types.SET_INTERNET_CONNECTION_STATUS, value: status })
  }
}

export function showToast(toastText, toastDuration) {
  return dispatch => {
    dispatch({ type: types.SHOW_TOAST, toastText, toastDuration: toastDuration || 3000, showToast: true })
    setTimeout(() => {
      dispatch({ type: types.SHOW_TOAST, showToast: false })
    }, 10)
  }
}

export function uploadFile(url) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api.file.uploadImage(url, (error, result)=>{
        resolve({error, result})
        dispatch({ type: types.IMAGE_UPLOAD, status:error?types.FAILED:types.SUCCESS, error, result })
      })
    })
  }
}
