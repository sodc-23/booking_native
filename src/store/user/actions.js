import * as types from './actionTypes';
import api from '@services'
import Global from "@utils/global";

export const getUserProfile = () => dispatch =>{
  var q = new Promise((resolve, reject) => {
    api.user.getUserDetail((error, result)=>{
      dispatch({type:types.USER_PROFILE, status:error?types.FAILED:types.SUCCESS, error, result})
    })
  })

  return q
}

export function updateUser(data){
  return dispatch=>{
    dispatch({type:types.USER_UPDATE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.user.update(data, (error, result)=>{
        dispatch({type:types.USER_UPDATE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function updateDevice(){
  return dispatch=>{
    return new Promise((resolve, reject)=>{
      api.user.updateDevice((error, result)=>{
        dispatch({type:types.DEVICE_UPDATE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function setPassword(oldPasssword, newPassword){
  return dispatch=>{
    return new Promise((resolve, reject)=>{
      dispatch({type:types.USER_UPDATE, status:types.LOADING})
      api.auth.login(Global.currentUser.contactInformation.email, oldPasssword, (err, ret)=>{
        if(err) {
          //old password wrong
          dispatch({type:types.USER_UPDATE, status:types.FAILED, err, ret})
          return resolve('NOT_FOUND')
        }
        api.user.setPassword(newPassword, (error, result)=>{
          dispatch({type:types.USER_UPDATE, status:error?types.FAILED:types.SUCCESS, error, result})
          resolve(error)
        })    
      })
    })
  }
}
