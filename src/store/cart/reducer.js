import * as types from "./actionTypes";
import moment from 'moment'

const initialState = {
  type: types.NONE,
  status: types.NONE,
  result:{},
  myBooks:[],
  bookDetail:{},
  coTravelers: [],
  ledgerEntries:null
};

export default function common(state = initialState, action = {}) {
  switch (action.type) {
    case types.ADD_CART:
      return {
        ...state,
        type: types.ADD_CART,
        status: action.status,
        error: action.error,
      }
    case types.VIEW_CART:
      return {
        ...state,
        type: types.VIEW_CART,
        status: action.status,
        result: action.result,
        coTravelers: action.coTravelers||[],
        error: action.error,
      }
    case types.REMOVE_CART:
      //reject cart item from cart
      var result = state.result
      if(action.status == types.SUCCESS) {
        result.items = result.items.filter((cartItem)=>cartItem.detailsID != action.data.key)
      }
      return {
        ...state,
        type: types.REMOVE_CART,
        status: action.status,
        result: result,
        error: action.error,
      }
    case types.ADD_TRAVELLERS:
      return {
        ...state,
        type: types.ADD_TRAVELLERS,
        status: action.status,
        error: action.error,
      }
    case types.BOOK_CART:
      return {
        ...state,
        type: types.BOOK_CART,
        status: action.status,
        error: action.error,
      }
    case types.MY_BOOKINGS:
      return {
        ...state,
        type: types.MY_BOOKINGS,
        status: action.status,
        error: action.error,
        myBooks: action.result
      }
    case types.BOOKING_DETAIL:
      return {
        ...state,
        type: types.BOOKING_DETAIL,
        status: action.status,
        error: action.error,
        bookDetail: action.result
      }
    case types.CANCEL_BOOKING_REQUEST:
      return {
        ...state,
        type: types.CANCEL_BOOKING_REQUEST,
        status: action.status,
        error: action.error
      }
    case types.MODIFY_BOOKING_REQUEST:
      return {
        ...state,
        type: types.MODIFY_BOOKING_REQUEST,
        status: action.status,
        error: action.error
      }
    case types.GET_LEDGER_ENTRIES:
      return{
        ...state,
        type: types.GET_LEDGER_ENTRIES,
        status: action.status,
        error: action.error,
        ledgerEntries:action.result
      }
    default:
      return state;
  }
}
