import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  faChevronDown,
  faChevronUp,
  faMinusSquare,
  faShoppingBag,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Spinner from "../../component/Spinner/Spinner";
import {
  deleteCartItem,
  fetchCart,
  updateCart,
} from "../../redux/thunks/cart-thunks";
import { AppStateType } from "../../redux/reducers/root-reducer";
import { CartItem } from "../../types/types";
import { API_BASE_URL } from "../../utils/constants/url";

const Cart: FC = () => {
  const dispatch = useDispatch();

  const cart: Array<CartItem> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const totalPrice: number = useSelector(
    (state: AppStateType) => state.cart.totalPrice
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.cart.loading
  );

  const customerId = useRef<number>(
    parseInt(sessionStorage.getItem("id") as string)
  );

  useEffect(() => {
    if (
      customerId === undefined ||
      customerId === null ||
      isNaN(customerId.current)
    )
      return;

    dispatch(fetchCart(customerId.current));
  }, []);

  const deleteFromCart = (productId: number): void => {
    dispatch(deleteCartItem(customerId.current, productId));
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    productId: number
  ): void => {
    if (
      isNaN(parseInt(event.target.value)) ||
      parseInt(event.target.value) === 0 ||
      parseInt(event.target.value) > 1000
    ) {
      dispatch(updateCart(customerId.current, productId, 10));
    } else {
      dispatch(
        updateCart(customerId.current, productId, parseInt(event.target.value))
      );
    }
  };

  const onIncrease = (productId: number, prevCount: number): void => {
    dispatch(updateCart(customerId.current, productId, prevCount + 1));
  };

  const onDecrease = (productId: number, prevCount: number): void => {
    dispatch(updateCart(customerId.current, productId, prevCount - 1));
  };

  return (
    <div className="container mt-5 pb-5" style={{ minHeight: "350px" }}>
      {loading ? (
        <Spinner />
      ) : (
        <div>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <h2>장바구니가 비었습니다.</h2>
            </div>
          ) : (
            <div>
              <p className="h4 mb-4 text-center">
                <FontAwesomeIcon className="mr-2" icon={faShoppingCart} />{" "}
                장바구니
              </p>
              {cart.map((cartItem: CartItem) => {
                return (
                  <div
                    key={cartItem.product.id}
                    className="card mb-3 mx-auto"
                    style={{ maxWidth: "940px" }}
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
                              "ko-KR"
                            )}{" "}
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
                            width: "65px",
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
                              ).toLocaleString("ko-KR")}{" "}
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
                            />{" "}
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
                    합계: <span>{totalPrice.toLocaleString("ko-KR")} 원</span>
                  </p>
                </div>
                <div className="col-3">
                  <div className="form-row">
                    <Link to={"/order"}>
                      <button className="btn btn-success">
                        <FontAwesomeIcon
                          className="mr-2"
                          icon={faShoppingBag}
                        />{" "}
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
