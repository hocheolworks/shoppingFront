import React, { ReactElement } from "react";

import { useSelector } from "react-redux";

import { Customer, FCinLayout } from "../../src/types/types";
import { AppStateType } from "../../src/redux/reducers/root-reducer";
import Spinner from "../../src/component/Spinner/Spinner";
import AccountLayout from "../../src/component/AccountLayout/AccountLayout";

const AccountItem: FCinLayout = () => {
  const usersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.customer.isLoaded
  );

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <h4 style={{ display: "flex", justifyContent: "center" }}>
            안녕하세요, 진솔유통입니다!
          </h4>
        </div>
      )}
    </div>
  );
};

AccountItem.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};
export default AccountItem;
