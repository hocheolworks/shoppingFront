import React, { FC, ReactElement, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import OrdersTable from "../../../src/component/OrdersTable/OrdersTable";
import { fetchAllUsersOrders } from "../../../src/redux/thunks/admin-thunks";
import { AppStateType } from "../../../src/redux/reducers/root-reducer";
import { FCinLayout, Order } from "../../../src/types/types";
import { compareOrderByCreatedAt } from "../../../src/utils/functions";
import AccountLayout from "../../../src/component/AccountLayout/AccountLayout";
import { useCheckAdmin } from "../../../src/hook/useCheckAdmin";
import Spinner from "../../../src/component/Spinner/Spinner";

const OrdersList: FCinLayout = () => {
  const dispatch = useDispatch();
  const isAdmin = useCheckAdmin();
  const adminOrders: Array<Order> = useSelector(
    (state: AppStateType) => state.admin.orders
  ).sort(compareOrderByCreatedAt);
  const loading: boolean = useSelector(
    (state: AppStateType) => state.admin.isLoaded
  );

  useEffect(() => {
    dispatch(fetchAllUsersOrders());
  }, []);

  return isAdmin ? (
    <OrdersTable loading={loading} orders={adminOrders} />
  ) : (
    <Spinner />
  );
};

OrdersList.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default OrdersList;
