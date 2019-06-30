import * as types from './actionTypes';
import api from '@services'

businesses=[
    {type:types.GET_ACTIVITY_HOTDEAL, business:types.activity},
    {type:types.GET_HOTEL_HOTDEAL, business:types.hotel},
    {type:types.GET_PACKAGE_HOTDEAL, business:types.package_},
    {type:types.GET_TRANSFER_HOTDEAL, business:types.transfer},
    {type:types.GET_VEHICLE_HOTDEAL, business:types.vehicle},
    {type:types.GET_ALL_HOTDEAL, business:types.all},
]

export function fetchAllHotDeal(){
    return fetchHotDeal(businesses[5])
}

export function fetchHotDeal({type, business}){
    return dispatch=>{
        dispatch({type, status:types.LOADING, business})
        api.hotDeal.getBaseHotDeal(business, (error, result)=>{
                dispatch({type, status:error==null?types.SUCCESS:types.FAILED, error, result, business})
        })
    }
}

export function fetchHotel(){
    return fetchHotDeal(businesses[1])
}
export function fetchPackage(){
    return fetchHotDeal(businesses[2])
}
export function fetchTransfer(){
    return fetchHotDeal(businesses[3])
}
export function fetchVehicle(){
    return fetchHotDeal(businesses[4])
}
export function fetchActivity(){
    return fetchHotDeal(businesses[0])
}
