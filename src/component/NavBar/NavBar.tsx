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
import { CartItem, CartItemNonMember } from "../../types/types";
import {} from "next";

const NavBar: FC = () => {
  const dispatch = useDispatch();
  const isLoggedIn: boolean = useSelector(
    (state: AppStateType) => state.auth.isLoggedIn
  );

  const cart: Array<CartItem | CartItemNonMember> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  let links;
  let signOut;
  let orderListLink;
  if (typeof window !== "undefined") {
    if (window.sessionStorage.getItem("isLoggedIn") === "true") {
      links = <Link href={"/account"}>마이페이지</Link>;
      signOut = (
        <Link href={"/"}>
          <a onClick={handleLogout}>로그아웃</a>
        </Link>
      );
      orderListLink = <Link href={"/account/customer/orders"}>주문내역</Link>;
    } else {
      links = (
        <>
          <Link href={"/login"}>
            <a style={{ fontWeight: "bold" }}>로그인</a>
          </Link>
          {/* <Link href={'/registration'}> */}
          <Link href={"/policy/join_us"}>
            <a style={{ fontWeight: "bold" }}>회원가입</a>
          </Link>
        </>
      );
      signOut = null;
      orderListLink = (
        <Link href={"/non-members/orders"}>
          <a style={{ fontWeight: "bold" }}>비회원 주문조회</a>
        </Link>
      );
    }
  }

  return (
    <>
      <header className="common-header main-header" id="common-header">
        <div className="top-utility">
          {links}
          {signOut}
          {typeof window !== "undefined" && (
            <Link href={"/cart"}>
              <a style={{ fontWeight: "bold" }}>장바구니({cart.length})</a>
            </Link>
          )}
          {orderListLink}
        </div>
        <Link href={"/"}>
          <a>
            <div id="header" className="image-fluid">
              <img
                src="/image/logo/new_design2.png"
                alt="jinsoltrade header image"
                className="rounded mx-auto d-block"
                height="100%"
              />
            </div>
          </a>
        </Link>
      </header>

      <div>
        <div className="container-fluid bg-black">
          <nav id="navbar-main">
            <ul>
              <li>
                <Link href={"/"}>
                  <a>
                    <span className="nav-link">홈</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/menu">
                  <a>
                    <span className="nav-link">상품 목록</span>
                  </a>
                </Link>
              </li>
              <li>
                <Link href={"/contacts"}>
                  <a>
                    <span className="nav-link">기업 소개 </span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavBar;
