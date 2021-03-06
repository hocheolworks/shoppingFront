import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

import { fetchAllUsers } from "../../../redux/thunks/admin-thunks";
import { AppStateType } from "../../../redux/reducers/root-reducer";
import { Customer } from "../../../types/types";
import Spinner from "../../../component/Spinner/Spinner";

const UsersList: FC = () => {
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
                <th>구분</th>
                <th>구분</th>
                <th></th>
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
                      <Link to={`/account/admin/users/${customer.id}`}>
                        자세히 보기
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

export default UsersList;
