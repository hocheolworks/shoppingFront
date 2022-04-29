import React, { FC, useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSignInAlt,
  faSignOutAlt,
  faUser,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';

import { logout } from '../../redux/thunks/auth-thunks';
// import './NavBar.css';
import { AppStateType } from '../../redux/reducers/root-reducer';
import { CartItem, Product } from '../../types/types';
import { fetchCustomerSuccess } from '../../redux/actions/customer-actions';

const NavBar: FC = () => {
  const dispatch = useDispatch();
  // const isLoggedIn: boolean = useSelector(
  //   (state: AppStateType) => state.auth.isLoggedIn
  // );

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const cart: Array<CartItem> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const isLoggedInLocalStorage: string | null =
      window.localStorage.getItem('isLoggedIn');
    if (isLoggedInLocalStorage) {
      setIsLoggedIn(isLoggedInLocalStorage === 'true');
    }
  }, []);

  let links;
  let signOut;
  if (typeof window != 'undefined') {
    if (window.localStorage.getItem('isLoggedIn') === 'true') {
      links = (
        <li className="nav-item">
          <Link href={'/account'}>
            <a>
              <span className="nav-link pl-5 pr-5">
                <FontAwesomeIcon className="mr-2" icon={faUser} />
                마이페이지
              </span>
            </a>
          </Link>
        </li>
      );
      signOut = (
        <Link href={'/'}>
          <a onClick={handleLogout}>
            <FontAwesomeIcon className="mr-2" icon={faSignOutAlt} />
            로그아웃
          </a>
        </Link>
      );
    } else {
      links = (
        <>
          <li className="nav-item">
            <Link href={'/login'}>
              <a className="nav-link pl-5 pr-3">
                <FontAwesomeIcon className="mr-2" icon={faSignInAlt} />
                로그인
              </a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href={'/registration'}>
              <a className="nav-link">
                <FontAwesomeIcon className="mr-2" icon={faUserPlus} />
                회원가입
              </a>
            </Link>
          </li>
        </>
      );
      signOut = null;
    }
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
          style={{ fontSize: '18px' }}
        >
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav mr-auto ">
              <li className="nav-item">
                <Link href={'/'}>
                  <a>
                    <span className="nav-link pl-5 pr-5">HOME</span>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/menu?id=all">
                  <a>
                    <span className="nav-link pl-5 pr-5">PRODUCTS</span>
                  </a>
                </Link>
              </li>
              <li className="nav-item">
                <Link href={'/contacts'}>
                  <a>
                    <span className="nav-link pl-5 pr-5">CONTACTS</span>
                  </a>
                </Link>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto">
              {isLoggedIn && (
                <li className="nav-item">
                  <Link href={'/cart'}>
                    <a className="nav-link">
                      <i
                        className="fas fa-shopping-cart fa-lg pl-5"
                        style={{ color: 'white' }}
                      ></i>
                      <h5
                        className="d-inline"
                        style={{
                          position: 'relative',
                          right: '15px',
                          bottom: '8px',
                        }}
                      >
                        <span className="badge badge-success">
                          {cart.length}
                        </span>
                      </h5>
                    </a>
                  </Link>
                </li>
              )}

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
