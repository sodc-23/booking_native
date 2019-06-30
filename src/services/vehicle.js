import Global from "@utils/global";
import baseApi from "./base";
import UtilService from "@utils/utils";
import * as config from "../config";
import base64 from 'base-64';

module.exports = {
  searchLocation(query, location, cb) {
    var request = {
      "location": location?{
        latitude:location.latitude,
        longitude:location.longitude,
      }:null,
      "request": query,
      "Flags": {},
      info: UtilService.getInfo('vehicle')
    }

    console.log('location request', request)
    baseApi.basicApi('/v1/vehicle/search/location', 'POST', request, (err, res) => {
      cb(err, res)
    })
  },

  search(requestData, cb) {
    requestData.info = UtilService.getInfo('vehicle')
    //console.log('requestData', requestData)
    baseApi.basicApiWithRawResponse('/v1/vehicle/search', 'POST', requestData, (err, res) => {
      if(!err && res.firstPage) {
        cb(null, res.firstPage.response, res.response.token)
      } else if(!err){
        cb(res.errs[0])
      } else {
        cb(err)
      }
    })
  },

  searchPage(requestData, cb) {
    requestData.info = UtilService.getInfo('vehicle')
    baseApi.basicApi('/v1/vehicle/search/page', 'POST', requestData, (err, res) => {
      cb(err, res)
    })
  },

  getDetail(data, token, cb) {
    var requestData = {
      "Request": {
        data,
        token
      },
      "Flags": {},
      info: UtilService.getInfo('vehicle')
    }
    console.log('vehicle requestData', requestData)
    baseApi.basicApi('/v1/vehicle/details', 'POST', requestData, (err, res) => {
      if(!err && res && res[0].item) {
        cb(null, res[0].item[0])
      } else
        cb(err, null)
    })
  },

  getPolicy(token, data, cb) {
    var requestData = {
      "request": {
        token,
        data
      },
      "flags": {},
      info: UtilService.getInfo('vehicle')
    }
    baseApi.basicApi('/v1/vehicle/policy', 'POST', requestData, (err, res) => {
      if(!err && res) {
        cb(null, res)
      } else
        cb(err, [])
    })
  },
  getFareRules(data, token, cb) {
    var requestData = {
      "Request": {
        data,
        token
      },
      "Flags": {},
      info: UtilService.getInfo('vehicle')
    }
    baseApi.basicApi('/v1/vehicle/farerules', 'POST', requestData, (err, res) => {
      cb(err, res)
    })
  },
  recentSearch(cb) {
    var requestData = {
      "request": "",
      "flags": {},
      info: UtilService.getInfo('vehicle')
    }
    baseApi.basicApi('/v1/home/recent/search', 'POST', requestData, (err, res) => {
      //console.log('recentSearch', err, JSON.stringify(res))
      if(!err) {
        cb(null, res)
      } else
        cb(err, [])
    })
  },
};
