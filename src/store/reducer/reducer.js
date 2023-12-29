import { getLSItem, removeLSItem, setLSItem } from "../../shared/LocalStorage";
import {
  AUTH_LOGOUT,
  UPDATE_AUTH_TOKEN,
  UPDATE_ERROR,
  UPDATE_LOADER,
  UPDATE_SUCCESS,
  UPDATE_USER,
  UPDATE_CART_ITEM
} from "../action/actionTypes";

const updateToken = (state, action) => {
  setLSItem("auth_token", action.value);
  return {
    ...state,
    auth_token: action.value,
  };
};

const updateUser = (state, action) => {
  setLSItem("user", JSON.stringify(action.value));
  return {
    ...state,
    user: action.value,
  };
};
const logout = (state, action) => {
  removeLSItem("user");
  removeLSItem("auth_token");
  removeLSItem("cart_detail");
  return {
    ...state,
    auth_token: null,
    user: null,
  };
};
const updateSuccess = (state, action) => {
  return {
    ...state,
    success: action.value,
    error: "",
  };
};
const updateError = (state, action) => {
  return {
    ...state,
    error: action.value,
    success: "",
  };
};
const updateLoader = (state, action) => {
  return {
    ...state,
    loader: action.value,
  };
};
const updateCartItem=(state,action)=>{
  setLSItem("cart_detail",(action.value))
  return{
    ...state,
    cart_detail:action.value
  }
}

const initialState = {
  user: getLSItem("user") ? JSON.parse(getLSItem("user")) : null,
  auth_token: getLSItem("auth_token"),
  success: "",
  error: "",
  loader: false,
  cart_detail: getLSItem("cart_detail")? getLSItem('cart_detail'):null,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_AUTH_TOKEN:
      return updateToken(state, action);
    case UPDATE_USER:
      return updateUser(state, action);
    case AUTH_LOGOUT:
      return logout(state, action);
    case UPDATE_SUCCESS:
      return updateSuccess(state, action);
    case UPDATE_ERROR:
      return updateError(state, action);
    case UPDATE_LOADER:
      return updateLoader(state, action);
    case UPDATE_CART_ITEM:
      return updateCartItem(state,action);
    default:
      return state;
  }
};
export default reducer;
