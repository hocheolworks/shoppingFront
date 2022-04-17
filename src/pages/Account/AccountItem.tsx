import React from "react";
import { useSelector } from "react-redux";

import { Customer } from "../../types/types";
import { AppStateType } from "../../redux/reducers/root-reducer";
import Spinner from "../../component/Spinner/Spinner";

const AccountItem = () => {
  const usersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.customer.isLoaded
  );

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <h4 style={{ display: "flex", justifyContent: "center" }}>Hello!</h4>
      )}
    </>
  );
};

export default AccountItem;
