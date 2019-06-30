import * as types from './actionTypes';
import api from '@services'
import Global from "@utils/global";

export function searchLocations(query, location, fromLocation){
  return dispatch=>{
    dispatch({type:types.GET_LOCATIONS, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.air.searchLocation(query, location, fromLocation, (error, result)=>{
        //console.log('searchLocations', error, result)
        dispatch({type:types.GET_LOCATIONS, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result, query})
      })
    })
  }
}

export function selectLocation({location, type, index}){
  console.log('selectLocation', location, type, index)
  if(type == 'fromLocation') {
    return dispatch=>{
      dispatch({type:types.SELECT_FROM_LOCATION, status:types.SUCCESS, error:null, result:location, index})
    }
  } else {
    return dispatch=>{
      dispatch({type:types.SELECT_TO_LOCATION, status:types.SUCCESS, error:null, result:location, index})
    }
  }
}

export function selectDate(fromDate, toDate, index){
  return dispatch=>{
    dispatch({type:types.SELECT_DATE, status:types.SUCCESS, error:null, result:{fromDate, toDate}, index})
  }
}

export function setPassengers(passengers){
  return dispatch=>{
    dispatch({type:types.SELECT_PASSENGERS, status:types.SUCCESS, error:null, result:passengers})
  }
}

export function addWay(){
  return dispatch=>{
    dispatch({type:types.ADD_WAY, status:types.SUCCESS})
  }
}

export function removeWay(){
  return dispatch=>{
    dispatch({type:types.REMOVE_WAY, status:types.SUCCESS})
  }
}

export function searchOperator(){
  return dispatch=>{
    dispatch({type:types.GET_OPERATOR, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.air.searchOperator((error, result)=>{
        dispatch({type:types.GET_OPERATOR, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function search(requestData){
  return dispatch=>{
    dispatch({type:types.SEARCH_AIR, status:types.LOADING})
    dispatch({type:types.SET_SEARCH_DATA, searchData:requestData})

    return new Promise((resolve, reject)=>{
      api.air.search(requestData, (error, result, token)=>{
        console.log('search air result', JSON.stringify(result), token)
        dispatch({type:types.SEARCH_AIR, status:error?types.FAILED:types.SUCCESS, error, result, token})
        resolve({error, result, token})
      })
    })
  }
}

export function searchPage(requestData){
  // console.log('searchPage - requestData', requestData)
  return dispatch=>{
    dispatch({type:types.SEARCH_AIR_PAGE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.air.searchPage(requestData, (error, result)=>{
        // console.log('searchPage - result', error, result)              
        dispatch({type:types.SEARCH_AIR_PAGE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function searchPageNext(requestData){
  // console.log('searchPage - requestData', requestData)
  return dispatch=>{
    //dispatch({type:types.SEARCH_AIR_PAGE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.air.searchPage(requestData, (error, result)=>{
        //console.log('searchPage - result', error, JSON.stringify(result))
        dispatch({type:types.SEARCH_AIR_PAGE_NEXT, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function getDetail(id, token){
  return dispatch=>{
    dispatch({type:types.GET_AIR_DETAIL, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.air.getDetail(id, token, (error, result)=>{
        console.log('air detail', error, JSON.stringify(result))
        dispatch({type:types.GET_AIR_DETAIL, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function getFareRules(data, token){
  return dispatch=>{
    dispatch({type:types.GET_AIR_FARERULE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.air.getFareRules(data, token, (error, result)=>{
        console.log('air fare rule', error, JSON.stringify(result))
        dispatch({type:types.GET_AIR_FARERULE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function getFareBreakups(data, token){
  return dispatch=>{
    dispatch({type:types.GET_AIR_FAREBREAKUP, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.air.getFareBreakup(data, token, (error, result)=>{
        console.log('air fare breakup', error, JSON.stringify(result))
        dispatch({type:types.GET_AIR_FAREBREAKUP, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function recentSearch(){
  return dispatch=>{
    return new Promise((resolve, reject)=>{
      api.air.recentSearch((error, result)=>{
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
      api.air.getPolicy(token, data, (error, result)=>{
        console.log('getAirPolicy', error, JSON.stringify(result))
        dispatch({type:types.GET_POLICY, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

