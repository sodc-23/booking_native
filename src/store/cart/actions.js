import * as types from './actionTypes';
import api from '@services'
import Global from "@utils/global";

export function addToCart(token, data, config, flag) {
  return dispatch => {
    dispatch({ type: types.ADD_CART, status: types.LOADING })

    return new Promise((resolve, reject) => {
      if (Global.currentCart) {
        api.cart.addToCart(Global.currentCart, token, data, config, flag, (error, result) => {
          console.log('addToCart detail', error, result)
          dispatch({ type: types.ADD_CART, status: error ? types.FAILED : types.SUCCESS, error, result })
          resolve({ error, result })
        })
      } else {
        api.cart.createCart(token, data, config, flag, (error, result) => {
          console.log('createCart detail', error, result)
          if (!error && result) {
            Global.currentCart = result
          }
          dispatch({ type: types.ADD_CART, status: (error || !result) ? types.FAILED : types.SUCCESS, error, result })
          resolve({ error, result })
        })
      }
    })
  }
}

export function viewCart() {
  return dispatch => {
    dispatch({ type: types.VIEW_CART, status: types.LOADING })

    return new Promise((resolve, reject) => {
      api.cart.viewCart(Global.currentCart, (error, result, coTravelers) => {
        console.log('viewCart[Action]', error, JSON.stringify(result))
        dispatch({ type: types.VIEW_CART, status: error ? types.FAILED : types.SUCCESS, error, result, coTravelers })
        resolve({ error, result })
      })
    })
  }
}

export function removeCart(cartID, token, data) {
  return dispatch => {
    dispatch({ type: types.REMOVE_CART, status: types.LOADING })

    return new Promise((resolve, reject) => {
      api.cart.removeFromCart(cartID, token, data, (error, result) => {
        //console.log('removeCart', error, result)
        dispatch({ type: types.REMOVE_CART, status: error ? types.FAILED : types.SUCCESS, error, data })
        resolve({ error, result })
      })
    })
  }
}

export function clearCart(cartID) {
  return dispatch => {
    api.cart.clearCart(cartID, (error, result) => {
      //console.log('removeCart', error, result)
      dispatch({ type: types.CLEAR_CART, status: error ? types.FAILED : types.SUCCESS, error })
    })
  }
}

export function addTravellers(requestData) {
  return dispatch => {
    dispatch({ type: types.ADD_TRAVELLERS, status: types.LOADING })

    return new Promise((resolve, reject) => {
      api.cart.addTravellers(requestData, (error, result) => {
        dispatch({ type: types.ADD_TRAVELLERS, status: error ? types.FAILED : types.SUCCESS, error, result })
        resolve({ error, result })
      })
    })
  }
}

export function addInputs(requestData) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      api.cart.addInputs(requestData, (error, result) => {
        dispatch({ type: types.ADD_INPUTS, status: error ? types.FAILED : types.SUCCESS, error, result })
        resolve({ error, result })
      })
    })
  }
}

export function bookCart(cartId, paymentGatewayId, paymentReturnUrl, itineraryName) {
  return dispatch => {
    dispatch({ type: types.BOOK_CART, status: types.PAYMENT_LOADING })

    return new Promise((resolve, reject) => {
      api.cart.book(cartId, paymentGatewayId, paymentReturnUrl, itineraryName, (error, result) => {
        //console.log('removeCart', error, result)
        dispatch({ type: types.BOOK_CART, status: error ? types.FAILED : types.SUCCESS, error, result })
        resolve({ error, result })
      })
    })
  }
}

export function getMyBookings(bookingType) {
  return dispatch => {
    dispatch({ type: types.MY_BOOKINGS, status: types.LOADING })

    return new Promise((resolve, reject) => {
      api.cart.getMyBookings(bookingType, (error, result) => {
        dispatch({ type: types.MY_BOOKINGS, status: error ? types.FAILED : types.SUCCESS, error, result })
        resolve({ error, result })
      })
    })
  }
}

export function getMyBookingDetail(requestData) {
  return dispatch => {
    dispatch({ type: types.BOOKING_DETAIL, status: types.LOADING })

    return new Promise((resolve, reject) => {
      api.cart.getMyBookingDetail(requestData, (error, result) => {
        //console.log('removeCart', error, result)
        dispatch({ type: types.BOOKING_DETAIL, status: error ? types.FAILED : types.SUCCESS, error, result })
        resolve({ error, result })
      })
    })
  }
}

export function cancelBooking(requestData) {
  return dispatch => {
    dispatch({ type: types.CANCEL_BOOKING, status: types.LOADING })

    return new Promise((resolve, reject) => {
      api.cart.cancel(requestData, (error, result) => {
        dispatch({ type: types.CANCEL_BOOKING, status: error ? types.FAILED : types.SUCCESS, error, result })
        resolve({ error, result })
      })
    })
  }
}

export function cancelFares(requestData) {
  return dispatch => {
    dispatch({ type: types.CANCEL_FARES, status: types.LOADING })

    return new Promise((resolve, reject) => {
      api.cart.cancelFares(requestData, (error, result) => {
        dispatch({ type: types.CANCEL_FARES, status: error ? types.FAILED : types.SUCCESS, error, result })
        resolve({ error, result })
      })
    })
  }
}

export function cancelBookingRequest(requestData) {
  return dispatch => {
    dispatch({ type: types.CANCEL_BOOKING_REQUEST, status: types.LOADING })

    return new Promise((resolve, reject) => {
      api.cart.cancelBookingRequest(requestData, (error, result) => {
        //console.log('removeCart', error, result)
        dispatch({ type: types.CANCEL_BOOKING_REQUEST, status: error ? types.FAILED : types.SUCCESS, error, result })
        resolve({ error, result })
      })
    })
  }
}

export function modifyBookingRequest(requestData) {
  return dispatch => {
    dispatch({ type: types.MODIFY_BOOKING_REQUEST, status: types.LOADING })

    return new Promise((resolve, reject) => {
      api.cart.modifyBookingRequest(requestData, (error, result) => {
        //console.log('removeCart', error, result)
        dispatch({ type: types.MODIFY_BOOKING_REQUEST, status: error ? types.FAILED : types.SUCCESS, error, result })
        resolve({ error, result })
      })
    })
  }
}

export function getLedgerEntries(CurrentPage, PageLength) {
  return dispatch => {
    dispatch({ type: types.GET_LEDGER_ENTRIES, status: types.LOADING })
    return new Promise((resolve, reject) => {
      const requestData = {
        Request: {
          Filters: [
            {
              MinValue: "2017-06-01T00:00:00",
              MaxValue: "2019-07-29T00:00:00",
              MinMaxList: [],
              Name: "daterange"
            },
            {
              MinMaxList: [],
              Name: "transactiontype",
              DefaultValue: "0"
            }
          ],
          PageInfo: {
            CurrentPage,
            PageLength
          }
        },
        Flags: {}
      }
      api.cart.getLedgerEntries(requestData, (error, result) => {
        console.log(error, result)
        dispatch({ type: types.GET_LEDGER_ENTRIES, status: error ? types.FAILED : types.SUCCESS, error, result })
        resolve({ error, result })
      })
    })
  }
}