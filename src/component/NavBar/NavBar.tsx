import React, { FC, useEffect, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSignInAlt,
  faSignOutAlt,
  faUser,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";

import { logout } from "../../redux/thunks/auth-thunks";
import { AppStateType } from "../../redux/reducers/root-reducer";
import { CartItem } from "../../types/types";
import {} from "next";

const NavBar: FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn: boolean = useSelector(
    (state: AppStateType) => state.auth.isLoggedIn
  );

  const cart: Array<CartItem> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  let links;
  let signOut;
  if (typeof window !== "undefined") {
    if (window.sessionStorage.getItem("isLoggedIn") === "true") {
      links = (
        <div className="nav-item right-item">
          <Link href={'/account'}>
            <a>
              <span className="nav-link nav-icon">
                <i
                className="fas fa-user mr-2"
                ></i>
                마이페이지
              </span>
            </a>
          </Link>
        </div>
      );
      signOut = (
        <div className="nav-item right-item">
          <Link href={'/'}>
            <a onClick={handleLogout}>
              <span className="nav-link nav-icon">
                <FontAwesomeIcon className="mr-2" icon={faSignOutAlt} />
                로그아웃
              </span>
            </a>
          </Link>
        </div>
      );
    } else {
      links = (
        <>
          <div className='nav-item'></div>
          <div className="nav-item right-item">
            <Link href={'/login'}>
              <a>
                <span className="nav-link nav-icon">
                  <FontAwesomeIcon className="mr-2" icon={faSignInAlt} />
                  로그인
                </span>
              </a>
            </Link>
          </div>
          <div className="nav-item right-item">
            <Link href={'/registration'}>
              <a>
                <span className="nav-link">
                  <FontAwesomeIcon className="mr-2" icon={faUserPlus} />
                  회원가입
                </span>
              </a>
            </Link>
          </div>
        </>
      );
      signOut = null;
    }
  }

  return (
    <div>
      <div
        id="header"
        className="container-fluid header-top pb-5 pt-5"
      >
        <img src="/image/logo/1x.png" className="rounded mx-auto d-block" />
      </div>
      <div className="container-fluid bg-black">
      <div></div>
        <nav id="navbar-main">
          <div id="navbarSupportedContent">
            <div className="navbar-nav left-items">
              <div className="nav-item">
                <Link href={'/'}>
                  <a>
                    <span className="nav-link">HOME</span>
                  </a>
                </Link>
              </div>
              <div className="nav-item">
                <Link href="/menu">
                  <a>
                    <span className="nav-link">PRODUCT</span>
                  </a>
                </Link>
              </div>
              <div className="nav-item">
                <Link href={'/contacts'}>
                  <a>
                    <span className="nav-link">CONTACT</span>
                  </a>
                </Link>
              </div>
            </div>
            <div className="navbar-nav right-items">          
              {(typeof window !== 'undefined') &&
                sessionStorage.getItem('isLoggedIn') && (                
                <div className="nav-item">
                  <Link href={'/cart'}>
                    <a className="nav-link">
                      <h5
                        className="d-inline nav-icon"                        
                      >                        
                        <i className="fas fa-shopping-cart"></i>
                        <span className="badge badge-success ml-1">
                          {cart.length}
                        </span>
                      </h5>
                    </a>
                  </Link>
                </div>
              )}
              {links}
              {signOut}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default NavBar;
