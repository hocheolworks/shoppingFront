import { Dispatch } from "redux";

import { showLoader } from "../actions/auth-actions";
import {
  estimateSheetAddedSuccess,
  fetchAllEstimatesSuccess,
  fetchNonMemberOrdersSuccess,
  fetchOrderSuccess,
  fetchUserEstimatesSuccess,
  fetchUserOrdersByQuerySuccess,
  fetchUserOrdersSuccess,
  orderAddedFailure,
  orderAddedSuccess,
} from "../actions/order-actions";
import RequestService from "../../utils/request-service";
import { NextRouter } from "next/router";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  CartItem,
  CartItemNonMember,
  SheetRequestData,
} from "../../types/types";

export const fetchOrder = () => async (dispatch: Dispatch) => {
  dispatch(fetchOrderSuccess());
};

export const addOrder = (order: any) => async (dispatch: Dispatch) => {
  try {
    dispatch(showLoader());
    const response = await RequestService.post("/order/payment", order);
    dispatch(orderAddedSuccess(response.data));
  } catch (error: any) {
    dispatch(orderAddedFailure(error.response?.data));
  }
};

export const fetchUserOrders =
  (customerId: number | undefined) => async (dispatch: Dispatch) => {
    dispatch(showLoader());
    const response = await RequestService.get(
      `/order/customer/${customerId}`,
      false
    );
    dispatch(fetchUserOrdersSuccess(response.data));
  };

export const fetchNonMemberOrders =
  (orderId: string, customerName: string, customerPhoneNumber: string) =>
  async (dispatch: Dispatch) => {
    dispatch(showLoader());
    const response = await RequestService.post("/order/nonMember/orderList", {
      orderId,
      customerName,
      customerPhoneNumber,
    });

    if (
      response.data == -1 ||
      response.data == undefined ||
      response.data == ""
    ) {
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        title: `<strong>주문 정보 없음</strong>`,
        html: `<i>조회하신 정보로 주문내역이 조회되지 않습니다.</i>`,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "확인",
      });
    } else {
      dispatch(fetchNonMemberOrdersSuccess(response.data));
    }
  };

export const addSheetRequest =
  (
    sheetRequest: Partial<SheetRequestData>,
    customerId: number,
    orderItems: Array<CartItem | CartItemNonMember>
  ) =>
  async (dispatch: Dispatch) => {
    const MySwal = withReactContent(Swal);

    const response = await RequestService.post("/order/sheetRequest", {
      sheetRequest,
      customerId,
      orderItems,
    });

    if (response.data == 1) {
      MySwal.fire({
        title: `<strong>견적요청 완료</strong>`,
        html: `<i>요청이 완료되었습니다.</i>`,
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "확인",
      });
      dispatch(estimateSheetAddedSuccess());
    } else {
      MySwal.fire({
        title: `<strong>견적요청 에러</strong>`,
        html: `<i>견적 요청에 실패하였습니다.</i><br/>
      <i>잠시후 다시 시도해주세요.</i>`,
        icon: "error",
        showConfirmButton: true,
        confirmButtonText: "확인",
      });
    }
  };

export const fetchUserEstimates =
  (customerId: number | undefined) => async (dispatch: Dispatch) => {
    dispatch(showLoader());
    const response = await RequestService.get(
      `/order/customer/estimate/${customerId}`,
      false
    );
    dispatch(fetchUserEstimatesSuccess(response.data));
  };

export const fetchAllEstimates = () => async (dispatch: Dispatch) => {
  dispatch(showLoader());
  try {
    const response = await RequestService.get(
      "/order/admin/estimate/all",
      false
    );
    dispatch(fetchAllEstimatesSuccess(response.data));
  } catch (err: any) {
    console.log(err);
    dispatch(fetchAllEstimatesSuccess([]));
    dispatch(showLoader());
  }
};
