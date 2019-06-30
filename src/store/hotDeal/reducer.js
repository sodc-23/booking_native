import * as types from "./actionTypes";

const initialState = {
    hotel:{
        items:[],
        status: types.NONE,
        error: null
    },
    transfer:{
        items:[],
        status: types.NONE,
        error: null
    },
    package:{
        items:[],
        status: types.NONE,
        error: null
    },
    activity:{
        items:[],
        status: types.NONE,
        error: null
    },
    vehicle:{
        items:[],
        status: types.NONE,
        error: null
    },
    all:{
        items:[],
        status: types.NONE,
        error: null
    },
};

export default function common(state = initialState, action = {}) {
    switch (action.type) {
        case types.GET_HOTEL_HOTDEAL:
        case types.GET_ACTIVITY_HOTDEAL:
        case types.GET_TRANSFER_HOTDEAL:
        case types.GET_PACKAGE_HOTDEAL:
        case types.GET_VEHICLE_HOTDEAL:
        case types.GET_ALL_HOTDEAL:
            const {result, error, status, business}=action
            if (status==types.LOADING){
                state[business].status = types.LOADING
                return state
            }
            
            if ( error == null ){
                state[business].items = result.data[0].item
            }
            state[business].status = status
            state[business].error = error
            return {
                ...state,
                type:action.type
            }
        default:
            return state;
    }
}
