import * as types from './actionTypes';
import api from '@services'

export const getCoTravelers = () => dispatch =>{
  var q = new Promise((resolve, reject) => {
    api.cotraveller.getCoTravelers((error, result)=>{
      console.log('getCoTravelers', error, result)
      dispatch({type:types.COTRAVELLER_GET, status:error?types.FAILED:types.SUCCESS, error, result})
    })
  })

  return q
}

export function create(data){
  return dispatch=>{
    dispatch({type:types.COTRAVELLER_CREATE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.cotraveller.create(data, (error, result)=>{
        dispatch({type:types.COTRAVELLER_CREATE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function update(data){
  return dispatch=>{
    dispatch({type:types.COTRAVELLER_UPDATE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.cotraveller.update(data, (error, result)=>{
        dispatch({type:types.COTRAVELLER_UPDATE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function deleteCoTraveler(data){
  return dispatch=>{
    //dispatch({type:types.COTRAVELLER_DELETE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.cotraveller.delete(data, (error, result)=>{
        dispatch({type:types.COTRAVELLER_DELETE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}
