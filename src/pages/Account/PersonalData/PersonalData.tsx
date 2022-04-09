import React, {FC} from 'react';
import {Link, Route, useLocation} from 'react-router-dom';
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressCard, faEdit, faEyeSlash} from "@fortawesome/free-solid-svg-icons";

import {Customer, User} from "../../../types/types";
import {AppStateType} from "../../../redux/reducers/root-reducer";
import EditPersonalData from "../EditPersonalData/EditPersonalData";
import "./PersonalData.css";

const PersonalData: FC = () => {
    const customersData: Partial<Customer> = useSelector((state: AppStateType) => state.user.customer);
    const  { id, customerEmail, customerName, customerPassword, customerPhoneNumber, customerAddress, userRole } = customersData;
    const location = useLocation();

    return (
        <div className="row">
            <div className="personal_data col-md-5">
                <h4 className="personal_data_title">
                    <FontAwesomeIcon className="ml-2 mr-2" icon={faAddressCard}/>Personal data
                </h4>
                <p className="personal_data_item">Email:
                    <span className="personal_data_text">{customerEmail}</span>
                </p>
                <p className="personal_data_item">Name:
                    <span className="personal_data_text">{customerName}</span>
                </p>
                <p className="personal_data_item">Password:
                    <span className="personal_data_text">{customerPassword}</span>
                </p>
                <p className="personal_data_item">Phone Number:
                    <span className="personal_data_text">{customerPhoneNumber}</span>
                </p>
                <p className="personal_data_item">Address:
                    <span className="personal_data_text">{customerAddress}</span>
                </p>
                <p className="personal_data_item">Role:
                    <span className="personal_data_text">{userRole}</span>
                </p>
                {location.pathname === "/account/user/info" ?
                    <Link to={"/account/user/info/edit"} className="btn btn-dark personal_data_btn">
                        <FontAwesomeIcon className="mr-2" icon={faEdit}/> Edit
                    </Link> :
                    <Link to={"/account/user/info"} className="btn btn-dark personal_data_btn">
                        <FontAwesomeIcon className="mr-2" icon={faEyeSlash}/> Hide
                    </Link>}
            </div>
            <div className="col-md-7">
                <Route path="/account/user/info/edit" component={() => <EditPersonalData/>}/>
            </div>
        </div>
    );
};

export default PersonalData;
