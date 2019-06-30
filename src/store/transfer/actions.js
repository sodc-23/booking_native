import * as types from './actionTypes';
import api from '@services'
import Global from "@utils/global";

export function searchLocations(query, location){
  return dispatch=>{
    dispatch({type:types.GET_LOCATIONS, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.transfer.searchLocation(query, location, (error, result)=>{
        //console.log('searchLocations', error, result)
        dispatch({type:types.GET_LOCATIONS, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result, query})
      })
    })
  }
}

export function selectLocation({location, type}){
  if(type == 'fromLocation') {
    return dispatch=>{
      dispatch({type:types.SELECT_FROM_LOCATION, status:types.SUCCESS, error:null, result:location})
    }
  } else {
    return dispatch=>{
      dispatch({type:types.SELECT_TO_LOCATION, status:types.SUCCESS, error:null, result:location})
    }
  }
}

export function selectDate(fromDate){
  return dispatch=>{
    dispatch({type:types.SELECT_DATE, status:types.SUCCESS, error:null, result:fromDate})
  }
}

export function selectType(value, type){
  return dispatch=>{
    if(type == 'from')
      dispatch({type:types.SELECT_FROM_TYPE, status:types.SUCCESS, error:null, result:value})
    else   
      dispatch({type:types.SELECT_TO_TYPE, status:types.SUCCESS, error:null, result:value})
  }
}

export function setPassengers(passengers, ages){
  return dispatch=>{
    dispatch({type:types.SELECT_PASSENGERS, status:types.SUCCESS, error:null, result:passengers, ages})
  }
}

export function search(requestData){
  return dispatch=>{
    dispatch({type:types.SEARCH_TRANSFER, status:types.LOADING})
    dispatch({type:types.SET_SEARCH_DATA, searchData:requestData})

    return new Promise((resolve, reject)=>{
      api.transfer.search(requestData, (error, result, token)=>{
        console.log('search transfer result', JSON.stringify(result), token)
        dispatch({type:types.SEARCH_TRANSFER, status:error?types.FAILED:types.SUCCESS, error, result, token})
        resolve({error, result, token})
      })
    })
  }
}

export function searchMap(token){
  return dispatch=>{
    dispatch({type:types.SEARCH_MAP, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.transfer.searchMap(token, (error, result)=>{
        dispatch({type:types.SEARCH_MAP, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function searchPage(requestData){
  // console.log('searchPage - requestData', requestData)
  return dispatch=>{
    dispatch({type:types.SEARCH_TRANSFER_PAGE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.transfer.searchPage(requestData, (error, result)=>{
        // console.log('searchPage - result', error, result)              
        dispatch({type:types.SEARCH_TRANSFER_PAGE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function searchPageNext(requestData){
  // console.log('searchPage - requestData', requestData)
  return dispatch=>{
    //dispatch({type:types.SEARCH_TRANSFER_PAGE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.transfer.searchPage(requestData, (error, result)=>{
        // console.log('searchPage - result', error, result)
        dispatch({type:types.SEARCH_TRANSFER_PAGE_NEXT, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function getDetail(id, token){
  return dispatch=>{
    dispatch({type:types.GET_TRANSFER_DETAIL, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.transfer.getDetail(id, token, (error, result)=>{
        console.log('transfer detail', error, JSON.stringify(result))
        dispatch({type:types.GET_TRANSFER_DETAIL, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function recentSearch(){
  return dispatch=>{
    return new Promise((resolve, reject)=>{
      api.transfer.recentSearch((error, result)=>{
        // console.log('searchPage - result', error, result)
        
        dispatch({type:types.RECENT_SEARCH, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function getPolicy(token, data){
  return dispatch=>{
    dispatch({type:types.GET_POLICY, status:types.LOADING_POLICY})

    return new Promise((resolve, reject)=>{
      api.transfer.getPolicy(token, data, (error, result)=>{
        console.log('getTransferPolicy', error, JSON.stringify(result))
        dispatch({type:types.GET_POLICY, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}