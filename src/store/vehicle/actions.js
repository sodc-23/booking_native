import * as types from './actionTypes';
import api from '@services'
import Global from "@utils/global";

export function searchLocations(query, location){
  return dispatch=>{
    dispatch({type:types.GET_LOCATIONS, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.vehicle.searchLocation(query, location, (error, result)=>{
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
    dispatch({type:types.SEARCH_VEHICLE, status:types.LOADING})
    dispatch({type:types.SET_SEARCH_DATA, searchData:requestData})

    return new Promise((resolve, reject)=>{
      api.vehicle.search(requestData, (error, result, token)=>{
        console.log('search vehicle result', JSON.stringify(result), token)
        dispatch({type:types.SEARCH_VEHICLE, status:error?types.FAILED:types.SUCCESS, error, result, token})
        resolve({error, result, token})
      })
    })
  }
}

export function searchMap(token){
  return dispatch=>{
    dispatch({type:types.SEARCH_MAP, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.vehicle.searchMap(token, (error, result)=>{
        dispatch({type:types.SEARCH_MAP, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function searchPage(requestData){
  // console.log('searchPage - requestData', requestData)
  return dispatch=>{
    dispatch({type:types.SEARCH_VEHICLE_PAGE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.vehicle.searchPage(requestData, (error, result)=>{
        // console.log('searchPage - result', error, result)              
        dispatch({type:types.SEARCH_VEHICLE_PAGE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function searchPageNext(requestData){
  // console.log('searchPage - requestData', requestData)
  return dispatch=>{
    //dispatch({type:types.SEARCH_VEHICLE_PAGE, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.vehicle.searchPage(requestData, (error, result)=>{
        // console.log('searchPage - result', error, result)
        dispatch({type:types.SEARCH_VEHICLE_PAGE_NEXT, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function getDetail(id, token){
  return dispatch=>{
    dispatch({type:types.GET_VEHICLE_DETAIL, status:types.LOADING})

    return new Promise((resolve, reject)=>{
      api.vehicle.getDetail(id, token, (error, result)=>{
        console.log('vehicle detail', error, JSON.stringify(result))
        dispatch({type:types.GET_VEHICLE_DETAIL, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

export function getPolicy(token, data){
  return dispatch=>{
    dispatch({type:types.GET_POLICY, status:types.LOADING_POLICY})

    return new Promise((resolve, reject)=>{
      api.vehicle.getPolicy(token, data, (error, result)=>{
        console.log('getVehiclePolicy', error, JSON.stringify(result))
        dispatch({type:types.GET_POLICY, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}
export function getFareRules(data, token){
  return dispatch=>{
    dispatch({type:types.GET_VEHICLE_FARERULE})

    return new Promise((resolve, reject)=>{
      api.vehicle.getFareRules(data, token, (error, result)=>{
        console.log('vehicle fare rule', error, JSON.stringify(result))
        dispatch({type:types.GET_VEHICLE_FARERULE, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}
export function recentSearch(){
  return dispatch=>{
    return new Promise((resolve, reject)=>{
      api.vehicle.recentSearch((error, result)=>{
        // console.log('searchPage - result', error, result)
        
        dispatch({type:types.RECENT_SEARCH, status:error?types.FAILED:types.SUCCESS, error, result})
        resolve({error, result})
      })
    })
  }
}

