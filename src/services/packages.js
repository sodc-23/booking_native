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
      info: UtilService.getInfo('package', true)
    }

    console.log('location request', request)
    baseApi.basicApi('/v1/package/search/location', 'POST', request, (err, res) => {
      cb(err, res)
    })
  },
  getPromotedLocations(cb) {
    var languages = Global.environment.availableLanguages.map(o=>o.cultureName.split('-')[0])
    var langIndex = languages.indexOf(Global.language)

    var requestData = {
      "Request": {
        "FiltersIndex": [{
          "Code": "default",
          "Sequence": 0,
          "Item": [{
            "Type": "business",
            "DefaultValue": "all"
          }]
        }]
      },
      "Flags": {},
      info: {
        "CultureCode": Global.environment.availableLanguages[langIndex].cultureName,
      }
    }
    //console.log('requestData', requestData)
    baseApi.basicApi('/v1/cms/promotedlocations', 'POST', requestData, (err, res) => {
      cb(err, res)
    })
  },
  search(requestData, cb) {
    requestData.info = UtilService.getInfo('package')
    //console.log('requestData', requestData)
    baseApi.basicApiWithRawResponse('/v1/package/search', 'POST', requestData, (err, res) => {
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
    requestData.info = UtilService.getInfo('package')
    baseApi.basicApi('/v1/package/search/page', 'POST', requestData, (err, res) => {
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
      info: UtilService.getInfo('package')
    }
    baseApi.basicApi('/v1/package/details', 'POST', requestData, (err, res) => {
      if(!err && res) {
        cb(null, res)
      } else
        cb(err, null)
    })
  },
  getDetail2(searchInfo, cb) {
    searchInfo.flags.isOverrideSearchToken = true
    searchInfo.info = UtilService.getInfo('package')
    baseApi.basicApiWithRawResponse('/v1/package/details', 'POST', searchInfo, (err, res) => {
      if(!err && res && res.response) {
        Global.searchToken['package'] = res.searchToken
        cb(null, res.response)
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
      info: UtilService.getInfo('package')
    }
    console.log('requesyData', requestData)
    baseApi.basicApi('/v1/package/policy', 'POST', requestData, (err, res) => {
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
      info: UtilService.getInfo('package')
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
