import Global from "@utils/global";
import baseApi from "./base";
import UtilService from "@utils/utils";
import * as config from "../config";
import base64 from 'base-64';

module.exports = {
  searchLocation(query, location, cb) {
    var request = {
      "info": UtilService.getInfo('activity', true),
      "location": location?{
        latitude:location.latitude,
        longitude:location.longitude,
      }:null,
      "request": query,
      "Flags": {}
    }

    console.log('location request', request)
    baseApi.basicApi('/v1/activity/search/location', 'POST', request, (err, res) => {
      cb(err, res)
    })
  },

  search(requestData, cb) {
    requestData.info = UtilService.getInfo('activity')
    //console.log('requestData', requestData)
    baseApi.basicApiWithRawResponse('/v1/activity/search', 'POST', requestData, (err, res) => {
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
    requestData.info = UtilService.getInfo('activity')
    baseApi.basicApi('/v1/activity/search/page', 'POST', requestData, (err, res) => {
      cb(err, res)
    })
  },

  getDetail(data, token, cb) {
    var requestData = {
      "info": UtilService.getInfo('activity'),
      "Request": {
        data,
        token
      },
      "Flags": {}
    }
    baseApi.basicApi('/v1/activity/details', 'POST', requestData, (err, res) => {
      if(!err && res) {
        cb(null, res)
      } else
        cb(err, null)
    })
  },

  getDetail2(activity, cb) {
    activity.info = UtilService.getInfo('activity')
    activity.flags.isOverrideSearchToken = true
    baseApi.basicApiWithRawResponse('/v1/activity/details', 'POST', activity, (err, res) => {
      if(!err && res && res.response) {
        Global.searchToken['activity'] = res.searchToken
        cb(null, res.response)
      } else
        cb(err, null)
    })
  },

  getPolicy(token, data, cb) {
    var requestData = {
      "info": UtilService.getInfo('activity'),
      "request": {
        token,
        data
      },
      "flags": {}
    }
    console.log('requesyData', requestData)
    baseApi.basicApi('/v1/activity/policy', 'POST', requestData, (err, res) => {
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
      info:UtilService.getInfo('activity'),
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
