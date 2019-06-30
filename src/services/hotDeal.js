import Global from "@utils/global";
import baseApi from "./base";
import UtilService from "@utils/utils";
import * as config from "../config";
import base64 from 'base-64';

module.exports = {
    getBaseHotDeal(business, cb) {
        body = {
            Info: {
                CultureCode: "en-US"
            },
            Request: {
                FiltersIndex: [
                    {
                        Code: "default",
                        Item: [
                            {
                                "Type": "business",
                                "DefaultValue": business
                            }
                        ]
                    }
                ]
            }
        }
        baseApi.basicApi('/v1/cms/hotdeals', 'POST', body, cb)
    },
    getHotelHotDeal(cb) {
        this.getBaseHotDeal('hotel', cb)
    },
    getActivityHotDeal(cb) {
        this.getBaseHotDeal('activity', cb)
    },
    getPackageHotDeal(cb) {
        this.getBaseHotDeal('package', cb)
    },
    getVehicleHotDeal(cb) {
        this.getBaseHotDeal('vehicle', cb)
    },
    getTransferHotDeal(cb) {
        this.getBaseHotDeal('transfer', cb)
    },
}