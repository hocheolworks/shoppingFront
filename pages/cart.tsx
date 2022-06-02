import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
  faChevronDown,
  faChevronUp,
  faMinusSquare,
  faShoppingBag,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Spinner from '../src/component/Spinner/Spinner';
import {
  deleteCartItem,
  fetchCart,
  updateCart,
} from '../src/redux/thunks/cart-thunks';
import { AppStateType } from '../src/redux/reducers/root-reducer';
import { CartItem, CartItemNonMember } from '../src/types/types';
import { API_BASE_URL } from '../src/utils/constants/url';
import {
  calculateCartPriceSuccess,
  removeCartItem,
  updateCartItem,
} from '../src/redux/actions/cart-actions';

const Cart: FC = () => {
  const dispatch = useDispatch();

  const cart: Array<CartItem | CartItemNonMember> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const totalPrice: number = useSelector(
    (state: AppStateType) => state.cart.totalPrice
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.cart.loading
  );

  const customerId = useRef<number>(0);

  useEffect(() => {
    customerId.current = parseInt(sessionStorage.getItem('id') as string);
    if (
      customerId === undefined ||
      customerId === null ||
      isNaN(customerId.current)
    )
      return;

    dispatch(fetchCart(customerId.current));
  }, []);

  useEffect(() => {
    let sum = 0;
    cart.forEach(
      (value) => (sum += value.product.productPrice * value.productCount)
    );
    dispatch(calculateCartPriceSuccess(sum));
  }, [cart]);

  const deleteFromCart = (productId: number): void => {
    if (isNaN(customerId.current) || customerId.current === 0) {
      // 비로그인 상태 : 비회원
      dispatch(removeCartItem(productId));
    } else {
      // 로그인 상태 : 회원
      dispatch(deleteCartItem(customerId.current, productId));
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    productId: number
  ): void => {
    const value: number = parseInt(event.target.value);

    if (isNaN(customerId.current) || customerId.current === 0) {
      // 비로그인 상태 : 비회원
      let newValue = value;

      if (isNaN(value) || value === 0 || value > 1000) {
        newValue = 10;
      }

      dispatch(updateCartItem(productId, newValue));
    } else {
      // 로그인 상태 : 회원
      if (isNaN(value) || value === 0 || value > 1000) {
        dispatch(updateCart(customerId.current, productId, 10));
      } else {
        dispatch(updateCart(customerId.current, productId, value));
      }
    }
  };

  const onIncrease = (productId: number, prevCount: number): void => {
    if (isNaN(customerId.current) || customerId.current === 0) {
      dispatch(updateCartItem(productId, prevCount + 1));
    } else {
      dispatch(updateCart(customerId.current, productId, prevCount + 1));
    }
  };

  const onDecrease = (productId: number, prevCount: number): void => {
    if (isNaN(customerId.current) || customerId.current === 0) {
      dispatch(updateCartItem(productId, prevCount - 1));
    } else {
      dispatch(updateCart(customerId.current, productId, prevCount - 1));
    }
  };

  return (
    <div className="container mt-5 pb-5" style={{ minHeight: '350px' }}>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center' }}>
              <h2>장바구니가 비었습니다.</h2>
            </div>
          ) : (
            <div>
              <p className="h4 mb-4 text-center">
                <FontAwesomeIcon className="mr-2" icon={faShoppingCart} />{' '}
                장바구니
              </p>
              {cart.map((cartItem: CartItem | CartItemNonMember) => {
                return (
                  <div
                    key={cartItem.product.id}
                    className="card mb-3 mx-auto"
                    style={{ maxWidth: '940px' }}
                  >
                    <div className="row no-gutters">
                      <div className="col-2 mx-3 my-3">
                        <img
                          src={`${cartItem.product.productImageFilepath}`}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-5">
                        <div className="card-body">
                          <h4 className="card-title">
                            {cartItem.product.productName}
                          </h4>
                          <p className="card-text">
                            {cartItem.product.productPrice.toLocaleString(
                              'ko-KR'
                            )}{' '}
                            원
                          </p>
                          <p className="card-text"></p>
                        </div>
                      </div>
                      <div className="col-1 mt-3 text-center">
                        <button
                          className="btn btn-default"
                          disabled={cartItem.productCount === 1000}
                          onClick={() =>
                            onIncrease(
                              cartItem.product.id,
                              cartItem.productCount
                            )
                          }
                        >
                          <FontAwesomeIcon size="lg" icon={faChevronUp} />
                        </button>
                        <input
                          type="text"
                          className="form-control input-number"
                          style={{
                            width: '65px',
                          }}
                          value={cartItem.productCount}
                          onChange={(event) =>
                            handleInputChange(event, cartItem.product.id)
                          }
                        />
                        <button
                          className="btn btn-default"
                          disabled={cartItem.productCount === 10}
                          onClick={() =>
                            onDecrease(
                              cartItem.product.id,
                              cartItem.productCount
                            )
                          }
                        >
                          <FontAwesomeIcon size="lg" icon={faChevronDown} />
                        </button>
                      </div>
                      <div className="col-3">
                        <div className="card-body text-right">
                          <h5 className="card-title">
                            <span>
                              {(
                                cartItem.product.productPrice *
                                cartItem.productCount
                              ).toLocaleString('ko-KR')}{' '}
                              원
                            </span>
                          </h5>
                          <button
                            className="btn btn-warning mb-2"
                            onClick={() => deleteFromCart(cartItem.product.id)}
                          >
                            <FontAwesomeIcon
                              className="mr-2"
                              icon={faMinusSquare}
                            />{' '}
                            삭제
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="row">
                <div className="col-9">
                  <p className="h5 text-right">
                    합계: <span>{totalPrice.toLocaleString('ko-KR')} 원</span>
                  </p>
                </div>
                <div className="col-3">
                  <div className="form-row">
                    <Link href={'/order'}>
                      <button className="btn btn-success">
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faShoppingBag}
                        />{' '}
                        주문하기
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
