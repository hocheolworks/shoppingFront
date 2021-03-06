import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  faChevronDown,
  faChevronUp,
  faClipboardList,
  faMinusSquare,
  faShoppingBag,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Spinner from "../src/component/Spinner/Spinner";
import {
  deleteCartItem,
  fetchCart,
  updateCart,
} from "../src/redux/thunks/cart-thunks";
import { AppStateType } from "../src/redux/reducers/root-reducer";
import { CartItem, CartItemNonMember } from "../src/types/types";
import { API_BASE_URL } from "../src/utils/constants/url";
import {
  calculateCartPriceSuccess,
  removeCartItem,
  returnToCartPage,
  updateCartItem,
} from "../src/redux/actions/cart-actions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useRouter } from "next/router";
const MySwal = withReactContent(Swal);

const Cart: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const cart: Array<CartItem | CartItemNonMember> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const totalPrice: number = useSelector(
    (state: AppStateType) => state.cart.totalPrice
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.cart.loading
  );

  const isLoggedIn: boolean = useSelector(
    (state: AppStateType) => state.customer.isLoggedIn
  );

  const customerId = useRef<number>(-1);

  useEffect(() => {
    customerId.current = parseInt(sessionStorage.getItem("id") as string);
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
    cart.forEach((value) => (sum += value.productPrice * value.productCount));
    dispatch(calculateCartPriceSuccess(sum));
  }, [cart]);

  const deleteFromCart = (productId: number): void => {
    if (isNaN(customerId.current) || customerId.current === 0) {
      // ???????????? ?????? : ?????????
      dispatch(removeCartItem(productId));
    } else {
      // ????????? ?????? : ??????
      dispatch(deleteCartItem(customerId.current, productId));
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement>,
    productId: number
  ): void => {
    const value: number = parseInt(event.target.value);

    // if (isNaN(customerId.current) || customerId.current === 0) {
    //   // ???????????? ?????? : ?????????
    //   let newValue = value;

    //   if (isNaN(value) || value > 10000) {
    //     if (value > 10000) {
    //       alert("?????? ????????? ?????? ??? ??????????????????!");
    //     } else {
    //       alert("????????? ????????? ?????????!");
    //     }
    //     newValue = 10;
    //   }

    // //   dispatch(updateCartItem(productId, newValue));
    // } else {
    //   // ????????? ?????? : ??????
    //   if (isNaN(value) || value === 0 || value > 10000) {
    //     dispatch(updateCart(customerId.current, productId, 10));
    //   } else {
    //     dispatch(updateCart(customerId.current, productId, value));
    //   }
    // }
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

  const onClickHandler = (): void => {
    if (isNaN(customerId.current) || customerId.current === -1) {
      // ???????????? ?????? : ?????????
      MySwal.fire({
        title: `<strong>????????? ??????</strong>`,
        html: `<i>????????? ???????????? ?????? ?????????????????????????</i>`,
        icon: "question",
        showConfirmButton: true,
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "??????",
        denyButtonText: "?????????",
        cancelButtonText: "??????",
      }).then((result) => {
        if (result.isConfirmed) {
          router.push("/policy/collect_info");
        } else if (result.isDenied) {
          dispatch(returnToCartPage());
          router.push("/login");
        }
      });
    } else {
      router.push("/order");
    }
  };

  const onClickSheet = (): void => {
    router.push("/sheet/request");
  };

  return (
    <div
      className="container mt-5 pb-5"
      style={{ minHeight: "350px" }}
      id="mid"
    >
      {loading ? (
        <Spinner />
      ) : (
        <div className="mb-5">
          {cart.length === 0 ? (
            <div style={{ textAlign: "center" }}>
              <h2>??????????????? ???????????????.</h2>
            </div>
          ) : (
            <div>
              <p className="h4 mb-4 text-center">
                <FontAwesomeIcon className="mr-2" icon={faShoppingCart} />{" "}
                ????????????
              </p>
              {cart.map((cartItem: CartItem | CartItemNonMember) => {
                return (
                  <div
                    key={cartItem.product.id}
                    className="card mb-3 mx-auto"
                    style={{ maxWidth: "940px" }}
                  >
                    <div className="row no-gutters">
                      <div className="col-3 mx-3 my-3">
                        <img
                          src={`${cartItem.product.productImageFilepath}`}
                          className="img-fluid"
                        />
                      </div>
                      <div className="col-4 text-left">
                        <div className="card-body">
                          <h4 className="card-title">
                            {cartItem.product.productName}
                          </h4>
                          <p className="card-text">
                            {cartItem.productPrice.toLocaleString("ko-KR")} ???
                          </p>
                          <p className="card-text"></p>
                        </div>
                      </div>
                      <div className="col-2 mt-5 text-center">
                        {/* <button
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
                        </button> */}
                        <span> {cartItem.productCount} ???</span>
                        {/* <button
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
                        </button> */}
                      </div>
                      <div id="price-remove">
                        <div className="card-body text-right">
                          <h5 className="card-title">
                            <span>
                              {(
                                cartItem.productPrice * cartItem.productCount
                              ).toLocaleString("ko-KR")}{" "}
                              ???
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
                            ??????
                          </button>
                        </div>
                      </div>
                    </div>
                    <br />
                  </div>
                );
              })}
              <div className="row d-flex mx-auto cart-end">
                <div className="col-8">
                  <p className="h5 text-right">
                    ??????: <span>{totalPrice.toLocaleString("ko-KR")} ???</span>
                  </p>
                </div>
                <div className="pl-3">
                  <div className="">
                    <button
                      className="btn btn-success"
                      onClick={onClickHandler}
                    >
                      <FontAwesomeIcon className="" icon={faShoppingBag} />{" "}
                      ????????????
                    </button>
                  </div>
                </div>
                {(isLoggedIn) && (
                <div className="pl-3">
                  <div className="">
                    <button
                      className="btn btn-secondary"
                      onClick={onClickSheet}
                    >
                      <FontAwesomeIcon className="" icon={faClipboardList} />{" "}
                      ????????????
                    </button>
                  </div>
                </div>
                )}                
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
