import { Dispatch } from "redux";

import {
  addProductFailure,
  addProductSuccess,
  getAllUsers,
  getAllUsersOrders,
  getUserInfo,
  getUserOrders,
  reset,
  updateProductFailure,
  updateProductSuccess,
  loadingData,
  deleteProductFailure,
  deleteProductSuccess,
  clearAddProductEditor,
} from "../actions/admin-actions";
import { fetchProductSuccess, getProducts } from "../actions/product-actions";
import RequestService from "../../utils/request-service";

export const addProduct = (data: FormData) => async (dispatch: Dispatch) => {
  try {
    const response = await RequestService.post(
      "/product",
      data,
      false,
      "multipart/form-data"
    );

    dispatch(addProductSuccess());
    dispatch(clearAddProductEditor());
    dispatch(fetchProductSuccess(response.data));
  } catch (error: any) {
    if (error === undefined || error.response === undefined) {
      console.log("error is undefined, wtf");
      return;
    }
    dispatch(addProductFailure(error.response.data));
  }
};

export const updateProduct =
  (productId: number, customerId: number, data: FormData) =>
  async (dispatch: Dispatch) => {
    try {
      const url: string = data.has("file")
        ? `/product/${productId}/w/image?customerId=${customerId}`
        : `/product/${productId}/w/o/image?customerId=${customerId}`;

      const bodyData = data.has("file")
        ? data
        : {
            productName: data.get("productName"),
            productDescription: data.get("productDescription"),
            productMinimumEA: parseInt(data.get("productMinimumEA") as string),
            productPrice: parseInt(data.get("productPrice") as string),
            productEA1: data.get("productEA1"),
            productEA2: data.get("productEA2"),
            productEA3: data.get("productEA3"),
            productEA4: data.get("productEA4"),
            productEA5: data.get("productEA5"),
            productPrice1: data.get("productPrice1"),
            productPrice2: data.get("productPrice2"),
            productPrice3: data.get("productPrice3"),
            productPrice4: data.get("productPrice4"),
            productPrice5: data.get("productPrice5"),
          };

      console.log(bodyData);

      const response = await RequestService.put(
        url,
        bodyData,
        false,
        data.has("file") ? "multipart/form-data" : "application/json"
      );

      dispatch(updateProductSuccess());
      dispatch(fetchProductSuccess(response.data));
    } catch (error: any) {
      if (error === undefined) {
        console.log("error is undefined, wtf");
        return;
      }
      dispatch(updateProductFailure(error.response.data));
    }
  };

export const deleteProduct =
  (productId: number, customerId: number) => async (dispatch: Dispatch) => {
    try {
      const response = await RequestService.delete(
        `/product/${productId}?customerId=${customerId}`
      );
      dispatch(deleteProductSuccess());
      dispatch(getProducts(response.data));
    } catch (err: any) {
      dispatch(deleteProductFailure(err.response.data.productError));
    }
  };

export const fetchAllUsersOrders = () => async (dispatch: Dispatch) => {
  dispatch(loadingData());
  const response = await RequestService.get("/order/all", true);
  dispatch(getAllUsersOrders(response.data));
};

export const fetchUserOrders = (id: string) => async (dispatch: Dispatch) => {
  const response = await RequestService.get("/order/customer/" + id, true);
  dispatch(getUserOrders(response.data));
};

export const fetchAllUsers = () => async (dispatch: Dispatch) => {
  dispatch(loadingData());
  const response = await RequestService.get("/customer/all", true);
  console.log(response);
  dispatch(getAllUsers(response.data));
};

export const fetchUserInfo = (id: string) => async (dispatch: Dispatch) => {
  dispatch(loadingData());
  const response = await RequestService.get("/customer/" + id, true);
  dispatch(getUserInfo(response.data));
};

export const formReset = () => async (dispatch: Dispatch) => {
  dispatch(reset());
};
