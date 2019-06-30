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
      info: UtilService.getInfo('bus', true)
    }

    console.log('location request', request)
    baseApi.basicApi('/v1/bus/search/location', 'POST', request, (err, res) => {
      cb(err, res)
    })
  },

  search(requestData, cb) {
    requestData.info = UtilService.getInfo('bus')
    //console.log('requestData', requestData)
    baseApi.basicApiWithRawResponse('/v1/bus/search', 'POST', requestData, (err, res) => {
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
    requestData.info = UtilService.getInfo('bus')
    baseApi.basicApi('/v1/bus/search/page', 'POST', requestData, (err, res) => {
      cb(err, res)
    })
  },

  getDetail(data, token, cb) {
    var requestData = {
      "CurrencyISOCode": Global.currency,
      "Request": {
        data,
        token
      },
      "Flags": {},
      info:UtilService.getInfo('bus')
    }
    baseApi.basicApi('/v1/bus/details', 'POST', requestData, (err, res) => {
      if(!err && res && res[0].item) {
        cb(null, res[0].item[0])
      } else
        cb(err, null)
    })
  },

  getTrackingLog(id, cb) {
    var requestData = {
      "Request": id,
      "Flags": {},
      info:UtilService.getInfo('bus')
    }
    baseApi.basicApi('/v1/bustracking/tracks', 'POST', requestData, (err, res) => {
      cb(err, res)
    })
  },

  getTrackingLogGeoJson(id, cb) {
    var requestData = {
      "Request": id,
      "Flags": {},
      info:UtilService.getInfo('bus')
    }
    baseApi.basicApi('/v1/bustracking/tracks/geojson', 'POST', requestData, (err, res) => {
      cb(err, res)
    })
  },

  getPolicy(token, data, cb) {
    var requestData = {
      "request": {
        token,
        data
      },
      "flags": {},
      info:UtilService.getInfo('bus')
    }
    baseApi.basicApi('/v1/bus/policy', 'POST', requestData, (err, res) => {
      if(!err && res) {
        cb(null, res)
      } else
        cb(err, [])
    })
  },
  recentSearch(cb) {
    var requestData = {
      "request": "",
      "flags": {},
      info:UtilService.getInfo('bus')
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
