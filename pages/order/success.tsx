import React, { FC, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import qs from "qs";
import { clearCart } from "../../src/redux/thunks/cart-thunks";
import { useRouter } from "next/router";
import RequestService from "../../src/utils/request-service";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { AppStateType } from "../../src/redux/reducers/root-reducer";
import { InsertOrder, Order } from "../../src/types/types";
import { clearCartSuccess } from "../../src/redux/actions/cart-actions";
import {
  clearInsertOrderInformation,
  hideLoader,
  showLoader,
} from "../../src/redux/actions/order-actions";
import Spinner from "../../src/component/Spinner/Spinner";
import PageLoader from "../../src/component/PageLoader/PageLoader";

const MySwal = withReactContent(Swal);

type OrderSuccessProps = {
  query: ParsedUrlQuery;
};

const OrderSuccess: FC<OrderSuccessProps> = ({ query }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const loading: boolean = useSelector(
    (state: AppStateType) => state.order.loading
  );
  const insertOrder: Partial<InsertOrder> = useSelector(
    (state: AppStateType) => state.order.insertOrder
  );

  const { orderId } = query;

  const customerId = useRef<number>(-1);

  useEffect(() => {
    dispatch(showLoader());
  }, []);

  useEffect(() => {
    customerId.current = parseInt(sessionStorage.getItem("id") as string);
    RequestService.post("/order/payment", {
      ...query,
      insertOrder: insertOrder,
    })
      .then((res) => {
        dispatch(clearInsertOrderInformation());
        dispatch(clearCartSuccess());
        dispatch(hideLoader());
      })
      .catch((err) => {
        console.log(err.response);
        MySwal.fire({
          title: `<strong>오류</strong>`,
          html: `<i>${err.response.data.message}</i>`,
          icon: "error",
        }).then(() => {
          router.push("/");
        });
      });
  }, []);

  return (
    <>
      <div className="container text-center mt-5">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <h2>주문이 완료되었습니다!</h2>
            <p>
              주문번호: <span>{(orderId as string).replace("order-", "")}</span>
            </p>
          </>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return { props: { query: context.query } };
};

export default OrderSuccess;
