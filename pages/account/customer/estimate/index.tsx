import React, { FC, ReactElement, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Order, Customer, FCinLayout, Estimate } from '../../../../src/types/types';
import { AppStateType } from '../../../../src/redux/reducers/root-reducer';
import { fetchUserEstimates, fetchUserOrders } from '../../../../src/redux/thunks/order-thunks';
import Spinner from '../../../../src/component/Spinner/Spinner';
import { compareEstimateByCreatedAt } from '../../../../src/utils/functions';
import AccountLayout from '../../../../src/component/AccountLayout/AccountLayout';
import EstimateTable from './estimateTable';

const PersonalEstimateList: FCinLayout = () => {
  const dispatch = useDispatch();
  const estimates: Array<Estimate> = useSelector(
    (state: AppStateType) => state.order.estimates
  ).sort(compareEstimateByCreatedAt);

  const loading: boolean = useSelector(
    (state: AppStateType) => state.order.loading
  );

  const customerId = useRef<number>(0);

  useEffect(() => {
    const id = sessionStorage.getItem('id');
    if (id) {
      customerId.current = parseInt(id);
      dispatch(fetchUserEstimates(customerId.current));
    }
  }, []);

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          {estimates.length === 0 ? (
            <h4
              style={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <FontAwesomeIcon className="ml-2 mr-2" icon={faShoppingBag} />
              요청한 견적서가 없습니다.
            </h4>
          ) : (
            <EstimateTable loading={loading} estimates={estimates} />
          )}
        </>
      )}
    </>
  );
};
PersonalEstimateList.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default PersonalEstimateList;
