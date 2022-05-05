import React, { FC, ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

import { fetchAllUsers } from '../../../../src/redux/thunks/admin-thunks';
import { AppStateType } from '../../../../src/redux/reducers/root-reducer';
import { Customer, FCinLayout } from '../../../../src/types/types';
import Spinner from '../../../../src/component/Spinner/Spinner';
import AccountLayout from '../../../../src/component/AccountLayout/AccountLayout';

const UsersList: FCinLayout = () => {
  const dispatch = useDispatch();
  const customers: Array<Customer> = useSelector(
    (state: AppStateType) => state.admin.customers
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.admin.isLoaded
  );

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, []);

  return (
    <div className="container">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h4>
            <FontAwesomeIcon className="ml-2 mr-2" icon={faUsers} /> 회원 목록
          </h4>
          <table className="table mt-4 border text-center">
            <thead className="table-active">
              <tr>
                <th>id</th>
                <th>고객명</th>
                <th>이메일</th>
                <th>주소</th>
                <th>권한</th>
                <th>...</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                return (
                  <tr key={customer.id}>
                    <th>{customer.id}</th>
                    <th>{customer.customerName}</th>
                    <th>{customer.customerEmail}</th>
                    <th>{customer.customerAddress}</th>
                    <th>{customer.customerRole}</th>
                    <th>
                      <Link href={`/account/admin/users/${customer.id}`}>
                        자세히
                      </Link>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

UsersList.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default UsersList;
