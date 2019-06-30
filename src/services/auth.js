import Global from "@utils/global";
import baseApi from "./base";
import UtilService from "@utils/utils";
import * as config from "../config";
import base64 from 'base-64';


module.exports = {
  async init(cb) {
    var storedAuthToken = await UtilService.getLocalStringData('authToken')
    const language = await UtilService.getLocalStringData('language')
    Global.setLanguage(language||'en')

    if (storedAuthToken) {
      Global.authToken = storedAuthToken
      Global.basicAuthToken = base64.encode(`${config.APPLICATION_ID}:${Global.authToken}`)
      console.log('Success initialize')
      if (cb)
        cb(null)
    } else {
      baseApi.noAuthApi('/v1/auth', 'POST', {
        "request": {
          "ApplicationID": config.APPLICATION_ID
        }
      }, (err, res) => {
        if (err == null) {
          Global.authToken = res.authToken
          UtilService.saveLocalStringData('authToken', Global.authToken)
          Global.basicAuthToken = base64.encode(`${config.APPLICATION_ID}:${Global.authToken}`)
          console.log('Success initialize')
        }
        if (cb)
          cb(err)
      })
    }
  },

  getApplicationEnvironment(cb) {
    baseApi.basicApi('/v1/application/environment', 'POST', {
      "request": {}
    }, (err, res) => {
      if (err == null) {
        Global.environment = res
        Global.dateFormat = (res.dateFormat||'DD/MM/YYYY').toUpperCase()
        Global.documentTypes = res.documentTypes
        Global.currency = res.portalCurrency.isoCode
      }
      if (cb)
        cb(err, res)
    })
  },

  login(email, password, cb) {
    baseApi.basicApi('/v1/user/login', 'POST', {
      "request": {
        "loginName": `${email}`,
        "password": `${password}`,
        "contactInformation": {
          "email": `${email}`
        }
      }
    }, (err, res) => {
      if (err == null) {
        Global.currentUser = res
        UtilService.saveLocalStringData('email', email);
        //UtilService.saveLocalStringData('password', password);
      }
      cb(err, res)
    })
  },

  simpleLogin(email, password, cb) {
    baseApi.basicApi('/v1/user/login', 'POST', {
      "request": {
        "loginName": `${email}`,
        "password": `${password}`,
        "contactInformation": {
          "email": `${email}`
        }
      }
    }, (err, res) => {
      cb(err, res)
    })
  },

  loginWithPhoneNumber(phoneNumber, countryCode, password, cb) {
    baseApi.basicApi('/v1/user/login', 'POST', {
      "request": {
        "password": `${password}`,
        "contactInformation": {
          "phoneNumber": `${phoneNumber}`,
          "phoneNumberCountryCode": `${countryCode}`
        }
      }
    }, (err, res) => {
      if (err == null) {
        Global.currentUser = res
        if(Global.currentUser.contactInformation.email)
          UtilService.saveLocalStringData('email', Global.currentUser.contactInformation.email);
        //UtilService.saveLocalStringData('password', password);
      }
      cb(err, res)
    })
  },

  logout(cb) {
    UtilService.removeLocalObjectData('email')
    Global.currentUser = null
    baseApi.basicApi('/v1/user/logout', 'POST', {
      "request": ""
    }, (err, res) => {
      cb(err, res)
    })
  },

  signup(requestData, cb) {
    baseApi.basicApi('/v1/user/signup', 'POST', requestData, (err, res) => {
      if (err == null) {
        Global.currentUser = res
        UtilService.saveLocalStringData('email', res.contactInformation.email);
        UtilService.saveLocalStringData('phoneNumber', res.contactInformation.phoneNumber);
        //UtilService.saveLocalStringData('password', password);
      }
      cb(err, res)
    })
  },

  generateOTP(phoneNumber, countryCode, cb) {
    baseApi.basicApi('/v1/user/otp/generate', 'POST', {
      "Request": {
        "ContactInformation": {
          "PhoneNumber": `${phoneNumber}`,
          "PhoneNumberCountryCode": `+${countryCode}`
        }
      }
    }, (err, res) => {
      cb(err)
    })
  },

  signupWithOpenID(requestData, cb) {
    baseApi.basicApi('/v1/user/signup', 'POST', {
      "Request": requestData,
      "Flags": {}
    }, (err, res) => {
      if(!err) {
        Global.currentUser = res
        if(res.contactInformation.email)
          UtilService.saveLocalStringData('email', res.contactInformation.email);
        if(res.contactInformation.phoneNumber)   
          UtilService.saveLocalStringData('phoneNumber', res.contactInformation.phoneNumber);
      }
      cb(err, res)
    })
  },

  forgetPassword(data, cb) {
    baseApi.basicApi('/v1/user/forgotpassword', 'POST', {
      "Request": {
        "ContactInformation": data
      }
    }, (err, res) => {
      cb(err)
    })
  },
};
