import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import {
  Customer,
  CustomerEdit,
  CustomerEditErrors,
} from "../../../types/types";
import { useDispatch, useSelector } from "react-redux";
import { AppStateType } from "../../../redux/reducers/root-reducer";
import {
  resetForm,
  updateCustomerInfo,
} from "../../../redux/thunks/customer-thunks";
import "./EditPersonalData.css";

const EditPersonalData: FC = () => {
  const dispatch = useDispatch();
  const customersData: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );
  const errors: Partial<CustomerEditErrors> = useSelector(
    (state: AppStateType) => state.customer.customerEditErrors
  );
  const [customer, setCustomer] = useState<Partial<Customer>>(customersData);
  const {
    id,
    customerEmail,
    customerName,
    customerPassword,
    customerPhoneNumber,
    customerAddress,
    customerRole,
  } = customer;
  const { firstNameError, lastNameError } = errors;

  useEffect(() => {
    dispatch(resetForm());
  }, []);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const customerEdit: CustomerEdit = {
      id,
      customerEmail,
      customerName,
      customerPassword,
      customerPhoneNumber,
      customerAddress,
      customerRole,
    };
    dispatch(updateCustomerInfo(customerEdit));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target;
    setCustomer({ ...customer, [name]: value });
  };

  return (
    <>
      <form className="edit_personal_data" onSubmit={onFormSubmit}>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Email: </label>
          <div className="col-sm-6">
            <input
              type="text"
              className={
                firstNameError ? "form-control is-invalid" : "form-control"
              }
              name="customerEmail"
              value={customerEmail}
              onChange={handleInputChange}
            />
            <div className="invalid-feedback">{firstNameError}</div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Name: </label>
          <div className="col-sm-6">
            <input
              type="text"
              className={
                lastNameError ? "form-control is-invalid" : "form-control"
              }
              name="customerName"
              value={customerName}
              onChange={handleInputChange}
            />
            <div className="invalid-feedback">{lastNameError}</div>
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Password: </label>
          <div className="col-sm-6">
            <input
              type="text"
              className={"form-control"}
              name="customerPassword"
              value={customerPassword}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Phone Number: </label>
          <div className="col-sm-6">
            <input
              type="text"
              className={"form-control"}
              name="customerPhoneNumber"
              value={customerPhoneNumber}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">Address: </label>
          <div className="col-sm-6">
            <input
              type="text"
              className={"form-control"}
              name="custormerAddress"
              value={customerAddress}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="col-sm-3 col-form-label">customerRole: </label>
          <div className="col-sm-6">
            <input
              type="text"
              className={"form-control"}
              name="customerRole"
              value={customerRole}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-dark">
          <FontAwesomeIcon className="mr-2" icon={faCheck} />
          Save
        </button>
      </form>
    </>
  );
};

export default EditPersonalData;
