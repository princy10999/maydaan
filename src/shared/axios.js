import axios from "axios";
import swal from "sweetalert";
import { BASE_URL } from "../store/action/actionTypes";
import { getLSItem, removeLSItem } from "./LocalStorage";
import { UPDATE_LOADER } from "../store/action/actionTypes";
import {store} from "../index"
const instance = axios.create({
  baseURL: BASE_URL + "api/",
});

const onRequestSuccess = (config) => {
  // Insert authorization token on request call
  const auth_token = getLSItem("auth_token");
  if (auth_token) config.headers["Authorization"] = "Bearer " + auth_token;

  return config;
};
const onRequestFailure = (error) => Promise.reject(error);

const onResponseSuccess = response => {
  return response;
};
const onResponseFailure = (error) => {
  if (error.response) {
    //console.log('response', error.response);
    if (error.response.status === 401 ){
      store.dispatch({ type: UPDATE_LOADER, value: false })
      swal(error.response.data.message, {
          icon: "warning",
          timer: 5000
      }).then(() => {
           removeLSItem("user");
          removeLSItem("auth_token");
          window.location.reload(false);
      });
    }
    else if (error.response.status === 401 && (error.response.data.message=="Token has expired" ||error.response.data.message=="Token Signature could not be verified.")) {
      store.dispatch({ type: UPDATE_LOADER, value: false })
      swal(error.response.data.message, {
          icon: "warning",
          timer: 5000
      }).then(() => {
           removeLSItem("user");
          removeLSItem("auth_token");
          window.location.reload(false);
      });
    }else if (error.response.status === 400 && error.response.data.token_exp_invalid) {
      store.dispatch({ type: UPDATE_LOADER, value: false })
      swal(error.response.data.token_exp_invalid, {
          icon: "warning",
          timer: 5000
      }).then(() => {
          removeLSItem("user");
          removeLSItem("auth_token");
        window.location.reload(false);
      });
    }

    return Promise.reject(error.response);
  } else {
    store.dispatch({ type: UPDATE_LOADER, value: false })
    const customMsg =
      "Server is taking longer time to respond, please try again later.";
    swal(customMsg, {
      icon: "warning",
      timer: 5000,
    }).then(() => {
      removeLSItem("user");
      removeLSItem("auth_token");
      window.location.reload(false);
    });
    return Promise.reject({
      data: {
        // message : message
      },
    });
  }
};

// Add a request interceptor
instance.interceptors.request.use(onRequestSuccess, onRequestFailure);

// Add a response interceptor
instance.interceptors.response.use(onResponseSuccess, onResponseFailure);

export default instance;
