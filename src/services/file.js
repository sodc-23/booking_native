import Global from "@utils/global";
import * as config from "../config";
import UtilService from "@utils/utils";

module.exports = {
  async uploadImage(file, cb) {
    // console.log('uploadImage',file)
    // if (!Global.hasInternetConnection) {
    //   let index = await this.pushApi('uploadImage', null, file)
    //   UtilService.saveLocalStringData('' + index, file)
    //   cb(null, index)
    //   return;
    // }
    try {
      let image = {
        uri: file,
        type: "image/jpeg",
        name: "file.jpeg"
      };

      let formData = new FormData();
      formData.append("file", image);
      // console.log('uploadImage',file)
      let response = await fetch(
        config.SERVICE_API_URL + "/common/files/upload",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: "basic " + Global.basicAuthToken
          },
          body: formData
        }
      );
      console.log('response', response)
      let status = response.status;

      let responseJson = await response.json();
      if (status == 200 || status == 201) {
        cb(null, responseJson);
      } else {
        cb(responseJson.message);
      }
    } catch (error) {
      cb(error);
    }
  },
};
