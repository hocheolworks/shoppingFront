import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ActiveLink from '../ActiveLink/ActiveLink';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formReset } from '../../../src/redux/thunks/admin-thunks';

const Account: FC = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(formReset());
  }, []);

  return (
    <div className="account-container container">
      <div className="row mt-5">
        <div className="col-md-2">
          <h4>
            <FontAwesomeIcon className="mr-2" icon={faUser} />
            마이 페이지
          </h4>
          <ActiveLink activeClassName="is-active" href="/account/customer/info">
            <a className="account-sidebar-link nav-link">내 정보</a>
          </ActiveLink>
          <ActiveLink
            activeClassName="is-active"
            href="/account/customer/password/confirm"
          >
            <a className="account-sidebar-link nav-link">비밀번호 변경</a>
          </ActiveLink>
          {typeof window !== 'undefined' &&
          window.localStorage.getItem('customerRole') === 'ADMIN' ? (
            <>
              <ActiveLink activeClassName="is-active" href="/account/admin/add">
                <a className="account-sidebar-link nav-link">상품 추가</a>
              </ActiveLink>
              <ActiveLink
                activeClassName="is-active"
                href="/account/admin/products"
              >
                <a className="account-sidebar-link nav-link">상품 목록</a>
              </ActiveLink>
              <ActiveLink
                activeClassName="is-active"
                href="/account/admin/orders"
              >
                <a className="account-sidebar-link nav-link">전체 주문 목록</a>
              </ActiveLink>
              <ActiveLink
                activeClassName="is-active"
                href="/account/admin/users"
              >
                <a className="account-sidebar-link nav-link">전체 고객 목록</a>
              </ActiveLink>
            </>
          ) : (
            <>
              <ActiveLink
                activeClassName="is-active"
                href="/account/customer/orders"
              >
                <a className="account-sidebar-link nav-link">주문 목록</a>
              </ActiveLink>
            </>
          )}
        </div>
        <div className="col-md-10">{children}</div>
      </div>
    </div>
  );
};

export default Account;