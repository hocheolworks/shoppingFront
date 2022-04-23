import React, { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  NavLink,
  Redirect,
  Route,
  RouteComponentProps,
} from 'react-router-dom';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formReset } from '../../redux/thunks/admin-thunks';
import { fetchCustomerInfo } from '../../redux/thunks/customer-thunks';
import PersonalOrdersList from './PersonalOrdersList/PersonalOrdersList';
import ChangePassword from './ChangePassword/ChangePassword';
import PersonalData from './PersonalData/PersonalData';
import AccountItem from './AccountItem';
import AddProduct from './AddProduct/AddProduct';
import OrdersList from './OrdersList/OrdersList';
import CustomersList from './CustomersList/CustomersList';
import ProductList from './ProductList/ProductList';
import ManageCustomer from './ManageCustomer/ManageCustomer';
import EditProduct from './EditProduct/EditProduct';
import ManageCustomerOrder from './ManageCustomerOrder/ManageCustomerOrder';
import './Account.css';

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
            to={'/account/user/info'}
            className="account-sidebar-link nav-link"
            activeClassName="is-active"
          >
            내 정보
          </NavLink>
          {localStorage.getItem('customerRole') === 'ADMIN' ? (
            <>
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
                to={'/account/user/edit'}
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
        <div className="col-md-10">
          <Route exact path="/account" component={() => <AccountItem />} />
          <Route path="/account/user/info" component={() => <PersonalData />} />
          <Route
            path="/account/user/edit"
            component={() => <ChangePassword />}
          />
          <Route
            exact
            path="/account/user/orders"
            component={() => <PersonalOrdersList />}
          />
          <Route
            exact
            path="/account/user/orders/:id"
            component={() => <ManageCustomerOrder />}
          />
          {localStorage.getItem('customerRole') === 'ADMIN' ? (
            <>
              <Route
                path="/account/admin/add"
                component={() => <AddProduct />}
              />
              <Route
                exact
                path="/account/admin/products"
                component={() => <ProductList />}
              />
              <Route
                exact
                path="/account/admin/products/:id"
                component={(props: RouteComponentProps<{ id: string }>) => (
                  <EditProduct {...props} />
                )}
              />
              <Route
                exact
                path="/account/admin/orders"
                component={() => <OrdersList />}
              />
              <Route
                exact
                path="/account/admin/users"
                component={() => <CustomersList />}
              />
              <Route
                exact
                path="/account/admin/users/:id"
                component={(props: RouteComponentProps<{ id: string }>) => (
                  <ManageCustomer {...props} />
                )}
              />
            </>
          ) : (
            <Redirect to={'/account'} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Account;
