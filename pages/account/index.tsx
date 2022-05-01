import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import {
//   NavLink,
//   Redirect,
//   Route,
//   RouteComponentProps,
// } from 'react-router-dom';

import Link from 'next/link';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formReset } from '../../src/redux/thunks/admin-thunks';
import { fetchCustomerInfo } from '../../src/redux/thunks/customer-thunks';

const Account: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(formReset());
    // dispatch(fetchCustomerInfo());
  }, []);

  return (
    <div className="account-container container">
      <div className="row mt-5">
        <div className="col-md-2">
          <h4>
            <FontAwesomeIcon className="mr-2" icon={faUser} />
            마이 페이지
          </h4>
          <NavLink
            to={'/account/customer/info'}
            className="account-sidebar-link nav-link"
            activeClassName="is-active"
          >
            내 정보
          </NavLink>
          <Link href="/account/customer/info">
            <a>내 정보</a>
          </Link>
          {localStorage.getItem('customerRole') === 'ADMIN' ? (
            <>
              <NavLink
                to={'/account/customer/password/confirm'}
                className="account-sidebar-link nav-link"
                activeClassName="is-active"
              >
                비밀번호 변경
              </NavLink>
              <NavLink
                to={'/account/admin/add'}
                className="account-sidebar-link nav-link"
                activeClassName="is-active"
              >
                상품 추가
              </NavLink>
              <NavLink
                to={'/account/admin/products'}
                className="account-sidebar-link nav-link"
                activeClassName="is-active"
              >
                상품 목록
              </NavLink>
              <NavLink
                to={'/account/admin/orders'}
                className="account-sidebar-link nav-link"
                activeClassName="is-active"
              >
                전체 주문 목록
              </NavLink>
              <NavLink
                to={'/account/admin/users'}
                className="account-sidebar-link nav-link"
                activeClassName="is-active"
              >
                전체 고객 목록
              </NavLink>
            </>
          ) : (
            <>
              <NavLink
                to={'/account/customer/password/confirm'}
                className="account-sidebar-link nav-link"
                activeClassName="is-active"
              >
                비밀번호 변경
              </NavLink>
              <NavLink
                to={'/account/user/orders'}
                className="account-sidebar-link nav-link"
                activeClassName="is-active"
              >
                주문 목록
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
