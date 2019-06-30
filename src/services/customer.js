import Global from "@utils/global";
import baseApi from "./base";

module.exports = {
  getCustomers(pageLength, currentPage, cb) {
    baseApi.basicApi('v1/customers', 'POST', {
      "Request": {
        "PageInfoIndex": [
          {
            "Type": "default",
            "Item": {
              "PageLength": pageLength,
              "CurrentPage": currentPage||1
            }
          }
        ]
      },
      "Flags": {}
    }, (err, res) => {
      cb(err, res)
    })
  },
  create(userData, cb) {
    baseApi.basicApi('/v1/customer/create', 'POST', {
      "request": userData,
      "Flags": {}
    }, (err, res) => {
      cb(err, res)
    })
  },
  update(userData, cb) {
    baseApi.basicApi('/v1/customer/update', 'POST', {
      "request": userData,
      "Flags": {}
    }, (err, res) => {
      cb(err, res)
    })
  },
};
