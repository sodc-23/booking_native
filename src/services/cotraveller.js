import Global from "@utils/global";
import baseApi from "./base";

module.exports = {
  getCoTravelers(cb) {
    baseApi.basicApi('/v1/cotraveler/details', 'POST', {
      "Request": "",
      "Flags": {}
    }, (err, res) => {
      cb(err, res)
    })
  },
  create(userData, cb) {
    baseApi.basicApi('/v1/cotraveler/create', 'POST', {
      "request": userData,
      "Flags": {}
    }, (err, res) => {
      console.log('create cotraveller', err, res)
      cb(err, res)
    })
  },
  update(userData, cb) {
    baseApi.basicApi('/v1/cotraveler/update', 'POST', {
      "request": userData,
      "Flags": {}
    }, (err, res) => {
      console.log('update cotraveller', err, res)
      cb(err, res)
    })
  },
  delete(userData, cb) {
    baseApi.basicApi('/v1/cotraveler/delete', 'POST', {
      "request": userData,
      "Flags": {}
    }, (err, res) => {
      cb(err, res)
    })
  }
};
