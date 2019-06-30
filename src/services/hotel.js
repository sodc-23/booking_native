import Global from "@utils/global";
import baseApi from "./base";
import UtilService from "@utils/utils";
import * as config from "../config";
import base64 from 'base-64';

module.exports = {
  searchLocation(query, location, cb) {
    var request = {
      "info" : UtilService.getInfo('hotel', true),
      "location": location?{
        latitude:location.latitude,
        longitude:location.longitude,
      }:null,
      "request": query,
      "Flags": {}
    }

    baseApi.basicApi('/v1/hotel/search/location', 'POST', request, (err, res) => {
      cb(err, res)
    })
  },
  
  search(requestData, cb) {
    requestData.info = UtilService.getInfo('hotel')
    baseApi.basicApiWithRawResponse('/v1/hotel/search', 'POST', requestData, (err, res) => {
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
    requestData.info = UtilService.getInfo('hotel')
    baseApi.basicApi('/v1/hotel/search/page', 'POST', requestData, (err, res) => {
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
      "info": UtilService.getInfo('hotel')
    }
    baseApi.basicApi('/v1/hotel/details', 'POST', requestData, (err, res) => {
      if(!err && res && res[0].item) {
        cb(null, res[0].item[0])
      } else
        cb(err, null)
    })
  },

  getDetail2(searchInfo, cb) {
    searchInfo.flags.isOverrideSearchToken = true
    searchInfo.info = UtilService.getInfo('hotel')
    baseApi.basicApiWithRawResponse('/v1/hotel/details', 'POST', searchInfo, (err, res) => {
      if(!err && res && res.response && res.response[0].item) {
        Global.searchToken['hotel'] = res.searchToken
        cb(null, res.response[0].item[0])
      } else
        cb(err, null)
    })
  },

  searchMap(token, cb) {
    var requestData = {
      "request": {
        token
      },
      "flags": {},
      "info": UtilService.getInfo('hotel')
    }
    baseApi.basicApi('/v1/hotel/search/map', 'POST', requestData, (err, res) => {
      if(!err && res.data) {
        cb(null, res.data)
      } else
        cb(err, [])
    })
  },

  recentSearch(cb) {
    var requestData = {
      "request": "",
      "flags": {},
      "info": UtilService.getInfo('hotel')
    }
    baseApi.basicApi('/v1/home/recent/search', 'POST', requestData, (err, res) => {
      if(!err) {
        cb(null, res)
      } else
        cb(err, [])
    })
  },

  getPolicy(token, data, cb) {
    var requestData = {
      "Request": {
        data,
        token
      },
      "Flags": {},
      "info": UtilService.getInfo('hotel')
    }
    baseApi.basicApi('/v1/hotel/policy', 'POST', requestData, (err, res) => {
      if(!err) {
        cb(null, res)
      } else
        cb(err, null)
    })
  },

};
