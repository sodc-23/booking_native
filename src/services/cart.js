import Global from "@utils/global";
import baseApi from "./base";
import UtilService from "@utils/utils";
import * as config from "../config";
import base64 from 'base-64';

module.exports = {
  createCart(token, data, config, flag, cb) {
    var requestData = {
      "Request": {
        token,
        data,
        config
      },
      "Flags": flag||{}
    }

    console.log('createCart requestData', requestData)

    baseApi.basicApi('/v1/cart/create', 'POST', requestData, (err, res) => {
      cb(err, res)
    })
  },

  addToCart(cartId, token, data, config, flag, cb) {
    var requestData = {
      "Request": {
        cartId,
        token,
        data,
        config
      },
      "Flags": flag||{}
    }
    console.log('addToCart requestData', requestData)
    baseApi.basicApi('/v1/cart/add', 'POST', requestData, (err, res) => {
      cb(err, res)
    })
  },

  viewCart(cartId, cb) {
    var requestData = {
      "Request": cartId,
      "Flags": {
        "lockcartifunlocked": true,
        "provideCoTravellerDetails": true
      }
    }

    console.log('requestData', requestData)

    baseApi.basicApiWithRawResponse('/v1/cart', 'POST', requestData, (err, res) => {
      if(err) {
        cb(err)
      } else {
        cb(null, res.response, res.coTravellerDetails?res.coTravellerDetails.response:[])
      }
    })
  },

  clearCart(cartId, cb) {
    var requestData = {
      "Request": {
        cartId
      },
    }

    baseApi.basicApi('/v1/cart/clear', 'POST', requestData, (err, res) => {
     cb(err, res)
    })
  },

  removeFromCart(cartId, token, data, cb) {
    var requestData = {
      "Request": {
        cartId,
        token,
        data
      },
      "Flags": {}
    }

    baseApi.basicApi('/v1/cart/remove', 'POST', requestData, (err, res) => {
      cb(err, res)
    })
  },
  
  book(cartId, paymentGatewayId, paymentReturnUrl, itineraryName, cb) {
    var requestData = {
      paymentGatewayId,
      paymentReturnUrl,
      itineraryName,
      request:cartId,
      "Flags": {}
    }

    console.log('requestData', requestData)
    baseApi.basicApi('/v1/cart/book', 'POST', requestData, (err, res) => {
      console.log('Book result', err, res)
      cb(err, res)
    })
  },
  
  getMyBookings(bookingType, cb) {
    var requestData = {
      "Request": {
        data: bookingType,
      },
      "Flags": {}
    }

    baseApi.basicApi('/v1/mybookings', 'POST', requestData, (err, res) => {
      console.log('myBooking result', err, JSON.stringify(res))
      cb(err, res)
    })
  },

  getMyBookingDetail(requestData, cb) {
    var requestData = {
      "Request": requestData,
      "Flags": {}
    }

    console.log('getMyBookingDetail request data', requestData)

    baseApi.basicApi('/v1/mybookings/details', 'POST', requestData, (err, res) => {
      console.log('getMyBookingDetail', err, JSON.stringify(res))
      cb(err, res)
    })
  },

  cancelBookingRequest(requestData, cb) {
    var requestData = {
      "Request": requestData,
      "Flags": {}
    }

    baseApi.basicApiWithRawResponse('/v1/mybookings/cancelrequest', 'POST', requestData, (err, res) => {
      console.log('cancelBookingRequest', err, JSON.stringify(res))
      cb(err, res.response, res)
    })
  },

  modifyBookingRequest(requestData, cb) {
    var requestData = {
      "Request": requestData,
      "Flags": {}
    }

    baseApi.basicApi('/v1/mybookings/modifyrequest', 'POST', requestData, (err, res) => {
      console.log('modifyBookingRequest', err, JSON.stringify(res))
      cb(err, res)
    })
  },

  addTravellers(requestData, cb) {
    console.log('addTravellersCart', JSON.stringify(requestData))
    baseApi.basicApi('/v1/cart/travellers/add', 'POST', requestData, (err, res) => {
      console.log("addTravellersCart result", err, JSON.stringify(res))
      cb(err, res)
    })
  },
  addInputs(requestData, cb) {
    console.log('addInputs', JSON.stringify(requestData))
    baseApi.basicApi('/v1/cart/inputs/add', 'POST', requestData, (err, res) => {
      console.log("addInputs result", err, JSON.stringify(res))
      cb(err, res)
    })
  },
  getLedgerEntries(requestData, cb){
    baseApi.basicApi('/v1/ledgerbalance', 'POST', requestData, cb)
  },

  cancel(requestData, cb) {
    var requestData = {
      "Request": requestData,
      "Flags": {}
    }

    baseApi.basicApiWithRawResponse('/v1/mybookings/cancel', 'POST', requestData, (err, res) => {
      console.log('cancel', err, JSON.stringify(res))
      cb(err, res.response, res)
    })
  },

  cancelFares(requestData, cb) {
    var requestData = {
      "Request": requestData,
      "Flags": {}
    }

    baseApi.basicApiWithRawResponse('/v1/mybookings/cancel/fares', 'POST', requestData, (err, res) => {
      console.log('cancelFares', err, JSON.stringify(res))
      cb(err, res.response, res)
    })
  },
};
