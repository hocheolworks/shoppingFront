import React, { FC } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

import { logout } from "../../redux/thunks/auth-thunks";
import "./NavBar.css";
import { AppStateType } from "../../redux/reducers/root-reducer";
import { Product } from "../../types/types";
import { fetchCustomerSuccess } from "../../redux/actions/customer-actions";

const NavBar: FC = () => {
  const dispatch = useDispatch();
  const products: Array<Product> = useSelector(
    (state: AppStateType) => state.cart.products
  );
  const isLoggedIn: boolean = useSelector(
    (state: AppStateType) => state.customer.isLoggedIn
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  let links;
  let signOut;

  if (localStorage.getItem("isLoggedIn") || isLoggedIn) {
    links = (
      <li className="nav-item">
        <Link to={"/account"}>
          <span className="nav-link pl-5 pr-5">
            <FontAwesomeIcon className="mr-2" icon={faUser} />
            마이페이지
          </span>
        </Link>
      </li>
    );
    signOut = (
      <Link to={"/"} onClick={handleLogout}>
        <FontAwesomeIcon className="mr-2" icon={faSignOutAlt} />
        로그아웃
      </Link>
    );
  } else {
    links = (
      <>
        <li className="nav-item">
          <Link to={"/login"} className="nav-link pl-5 pr-3">
            <FontAwesomeIcon className="mr-2" icon={faSignInAlt} />
            로그인
          </Link>
        </li>
        <li className="nav-item">
          <Link to={"/registration"} className="nav-link">
            <FontAwesomeIcon className="mr-2" icon={faUserPlus} />
            회원가입
          </Link>
        </li>
      </>
    );
    signOut = null;
  }

  return (
    <div>
      <div
        id="header"
        className="container-fluid header-top d-none d-md-block pb-5 pt-5"
      >
        <img src="/image/logo/main.png" className="rounded mx-auto d-block" />
      </div>
      <div className="container-fluid bg-black">
        <nav
          id="navbar-main"
          className={`container navbar navbar-expand-lg bg-black text-white `}
          style={{ fontSize: "18px" }}
        >
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto ">
              <li className="nav-item">
                <Link to={"/"}>
                  <span className="nav-link pl-5 pr-5">HOME</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to={{
                    pathname: "/menu",
                    state: { id: "all" },
                  }}
                >
                  <span className="nav-link pl-5 pr-5">PERFUMES</span>
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/contacts"}>
                  <span className="nav-link pl-5 pr-5">CONTACTS</span>
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/cart"}>
                  <i
                    className="fas fa-shopping-cart fa-lg pl-5"
                    style={{ color: "white" }}
                  ></i>
                  <h5
                    className="d-inline"
                    style={{
                      position: "relative",
                      right: "15px",
                      bottom: "8px",
                    }}
                  >
                    <span className="badge badge-success">
                      {products.length}
                    </span>
                  </h5>
                </Link>
              </li>
              {links}
            </ul>
            {signOut}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
