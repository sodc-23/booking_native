import Global from "@utils/global";
import * as config from "../config";
import UtilService from "@utils/utils";

module.exports = {
  async noAuthApi(sub_url, method, json_data, cb) {
    try {
      let request = {
        method,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          // "Accept-Encoding": "gzip"
        }
      };
      if (method == "POST" || method == "PUT") {
        request["body"] = JSON.stringify(json_data);
      }
      //console.log(request)
      let response = await fetch(config.SERVICE_API_URL + sub_url, request);
      if (response.status == 200) {
        let responseJson = await response.json();
        if(responseJson.status && responseJson.status.code == 0) {
          //success
          cb(null, responseJson.response)
        } else 
          cb(responseJson.status);
      } else {
        cb(responseJson);
      }
    } catch (error) {
      cb(error);
    }
  },

  async basicApi(sub_url, method, json_data, cb) {
    if(Global.basicAuthToken == null) {
      return cb({
        code : 10000,
        message : 'Initialize failure'
      })
    }

    try {
      let request = {
        method,
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          // "Accept-Encoding": "gzip",
          "Authorization": "basic " + Global.basicAuthToken
        }
      };
      if (method == "POST" || method == "PUT") {
        request["body"] = JSON.stringify(json_data);
      }
      //console.log(request)
      let response = await fetch(config.SERVICE_API_URL + sub_url, request);
      if (response.status == 200) {
        let responseJson = await response.json();
        if(responseJson.status && responseJson.status.code == 0) {
          //success
          cb(null, responseJson.response)
        } else 
          cb(responseJson.status);
      } else if (response.status == 204) {
        cb(null);
      } else {
        cb(response);
      }
    } catch (error) {
      cb(error);
    }
  },

  async basicApiWithRawResponse(sub_url, method, json_data, cb) {
    if(Global.basicAuthToken == null) {
      return cb({
        code : 10000,
        message : 'Initialize failure'
      })
    }

    try {
      let request = {
        method,
        headers: {
          "Accept": "application/json",
          // "Accept-Encoding": "gzip",
          "Content-Type": "application/json",
          "Authorization": "basic " + Global.basicAuthToken
        }
      };
      if (method == "POST" || method == "PUT") {
        request["body"] = JSON.stringify(json_data);
      }
      //console.log(request)
      let response = await fetch(config.SERVICE_API_URL + sub_url, request);
      if (response.status == 200) {
        let responseJson = await response.json();
        if(responseJson.status && responseJson.status.code == 0) {
          //success
          cb(null, responseJson)
        } else 
          cb(responseJson.status);
      } else {
        cb(response);
      }
    } catch (error) {
      cb(error);
    }
  },
};
