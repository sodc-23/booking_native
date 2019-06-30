import * as types from './actionTypes';
import api from '@services'
import Global from "@utils/global";

export function searchLocations(query, location){
  return dispatch=>{
    dispatch({type:types.GET_LOCATIONS, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.activity.searchLocation(query, location, (error, result)=>{
        //console.log('searchLocations', error, result)
        dispatch({type:types.GET_LOCATIONS, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result, query})
      })
    })
  }
}

export function selectLocation({location}){
  return dispatch=>{
    dispatch({type:types.SELECT_LOCATION, status:types.SUCCESS, error:null, result:location})
  }
}

export function selectDate(fromDate, toDate){
  return dispatch=>{
    dispatch({type:types.SELECT_DATE, status:types.SUCCESS, error:null, result:{fromDate, toDate}})
  }
}

export function selectRoom(rooms){
  return dispatch=>{
    dispatch({type:types.SELECT_ROOM, status:types.SUCCESS, error:null, result:rooms})
  }
}

export function setPassengers(passengers){
  return dispatch=>{
    dispatch({type:types.SELECT_PASSENGERS, status:types.SUCCESS, error:null, result:passengers})
  }
}

export function search(requestData){
  return dispatch=>{
    dispatch({type:types.SEARCH_ACTIVITY, status:types.LOADING})
    dispatch({type:types.SET_SEARCH_DATA, searchData:requestData})

    return new Promise((resolve, reject)=>{
      api.activity.search(requestData, (error, result, token)=>{
        console.log('search activity result', JSON.stringify(result), token)
        dispatch({type:types.SEARCH_ACTIVITY, status:error?types.FAILED:types.SUCCESS, error, result, token})
        resolve({error, result, token})
      })
    })
  }
}

export function searchMap(token){
  return dispatch=>{
    dispatch({type:types.SEARCH_MAP, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.activity.searchMap(token, (error, result)=>{
        dispatch({type:types.SEARCH_MAP, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function searchPage(requestData){
  // console.log('searchPage - requestData', requestData)
  return dispatch=>{
    dispatch({type:types.SEARCH_ACTIVITY_PAGE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.activity.searchPage(requestData, (error, result)=>{
        // console.log('searchPage - result', error, result)              
        dispatch({type:types.SEARCH_ACTIVITY_PAGE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function searchPageNext(requestData){
  // console.log('searchPage - requestData', requestData)
  return dispatch=>{
    //dispatch({type:types.SEARCH_ACTIVITY_PAGE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.activity.searchPage(requestData, (error, result)=>{
        // console.log('searchPage - result', error, result)
        dispatch({type:types.SEARCH_ACTIVITY_PAGE_NEXT, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function getDetail(id, token){
  return dispatch=>{
    dispatch({type:types.GET_ACTIVITY_DETAIL, status:types.LOADING})
    
    return new Promise((resolve, reject)=>{
      api.activity.getDetail(id, token, (error, result)=>{
        console.log('activity detail', error, JSON.stringify(result))
        dispatch({type:types.GET_ACTIVITY_DETAIL, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}
export function getActivityDetail2(activity){
  return dispatch=>{
    dispatch({type:types.GET_ACTIVITY_DETAIL, status:types.LOADING})
    dispatch({type:types.SET_SEARCH_DATA, searchData:{request:activity.searchInfo}})
    return new Promise((resolve, reject)=>{
      api.activity.getDetail2(activity, (error, result)=>{
        dispatch({type:types.GET_ACTIVITY_DETAIL, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function recentSearch(){
  return dispatch=>{
    return new Promise((resolve, reject)=>{
      api.activity.recentSearch((error, result)=>{
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
      api.activity.getPolicy(token, data, (error, result)=>{
        console.log('getActivityPolicy', error, JSON.stringify(result))
        dispatch({type:types.GET_POLICY, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}