import React, { ChangeEvent, FC, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  faChevronDown,
  faChevronUp,
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
import requestService from "../src/utils/request-service";

const MySwal = withReactContent(Swal);

const Cart: FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [priceInfo, setPriceInfo] = useState<any[]>([]);
  const [finalPrice, setFinalPrice] = useState(0);

  useEffect(() => {
    requestService.get("/product/all").then((res) => {
      setPriceInfo(res.data);
    });
  }, []);

  const cart: Array<CartItem | CartItemNonMember> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const totalPrice: number = useSelector(
    (state: AppStateType) => state.cart.totalPrice
  );
  const loading: boolean = useSelector(
    (state: AppStateType) => state.cart.loading
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
    cart.forEach(
      (value) => (sum += value.product.productPrice * value.productCount)
    );
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

    if (isNaN(customerId.current) || customerId.current === 0) {
      // ???????????? ?????? : ?????????
      let newValue = value;

      if (isNaN(value) || value === 0 || value > 10000) {
        newValue = 10;
        if (value > 10000) {
          alert("?????? ????????? ????????? ?????? ?????? ?????? ??? ??????????????????!");
        }
      }
      if (priceInfo !== []) {
        const targetProduct = priceInfo.filter((x) => x.id === productId)[0];
        let tempPrice = parseInt(targetProduct.productPrice);
        const price1 = targetProduct.productPrice1;
        const price2 = targetProduct.productPrice2;
        const price3 = targetProduct.productPrice3;
        const price4 = targetProduct.productPrice4;
        const price5 = targetProduct.productPrice5;
        const ea1 = parseInt(targetProduct.productEA1);
        const ea2 = parseInt(targetProduct.productEA2);
        const ea3 = parseInt(targetProduct.productEA3);
        const ea4 = parseInt(targetProduct.productEA4);
        const ea5 = parseInt(targetProduct.productEA5);
        console.log(targetProduct);

        if (value != NaN && 1 <= value && value < ea1) {
          tempPrice = price1;
          setFinalPrice(tempPrice);
        } else if (value < ea2 && value >= ea1) {
          tempPrice = price2;
          setFinalPrice(tempPrice);
        } else if (value < ea3 && value >= ea2) {
          tempPrice = price3;
          setFinalPrice(tempPrice);
        } else if (value < ea4 && value >= ea3) {
          tempPrice = price4;
          setFinalPrice(tempPrice);
        } else if (value >= ea5) {
          setFinalPrice(tempPrice);
          tempPrice = price5;
        } else {
          if (!isNaN(value)) {
            {
              alert("?????? ????????? ????????? ?????? ?????? ?????? ?????? ??????????????????!");
            }
          }
        }
      }

      const productPrice = finalPrice;
      dispatch(updateCartItem(productId, newValue, productPrice));
    } else {
      // ????????? ?????? : ??????
      if (isNaN(value) || value === 0 || value > 10000) {
        if (value > 10000) {
          alert("?????? ????????? ????????? ?????? ?????? ?????? ??? ??????????????????!");
        }
        // dispatch(updateCart(customerId.current, productId, 10, productPrice));
      } else {
        console.log("hereherehereherehereherehere");
        if (priceInfo !== []) {
          const targetProduct = priceInfo.filter((x) => x.id === productId)[0];
          let tempPrice = parseInt(targetProduct.productPrice);
          const price1 = targetProduct.productPrice1;
          const price2 = targetProduct.productPrice2;
          const price3 = targetProduct.productPrice3;
          const price4 = targetProduct.productPrice4;
          const price5 = targetProduct.productPrice5;
          const ea1 = parseInt(targetProduct.productEA1);
          const ea2 = parseInt(targetProduct.productEA2);
          const ea3 = parseInt(targetProduct.productEA3);
          const ea4 = parseInt(targetProduct.productEA4);
          const ea5 = parseInt(targetProduct.productEA5);

          if (value != NaN && 1 <= value && value < ea1) {
            tempPrice = price1;
            setFinalPrice(tempPrice);
          } else if (value < ea2 && value >= ea1) {
            tempPrice = price2;
            setFinalPrice(tempPrice);
          } else if (value < ea3 && value >= ea2) {
            tempPrice = price3;
            setFinalPrice(tempPrice);
          } else if (value < ea4 && value >= ea3) {
            tempPrice = price4;
            setFinalPrice(tempPrice);
          } else if (value >= ea5) {
            setFinalPrice(tempPrice);
            tempPrice = price5;
          } else {
            if (!isNaN(value)) {
              {
                alert("?????? ????????? ????????? ?????? ?????? ?????? ?????? ??????????????????!");
              }
            }
          }
        }

        const productPrice = finalPrice;
        dispatch(
          updateCart(customerId.current, productId, value, productPrice)
        );
      }
    }
  };

  // const onIncrease = (productId: number, prevCount: number): void => {
  //   if (isNaN(customerId.current) || customerId.current === 0) {
  //     dispatch(updateCartItem(productId, prevCount + 1));
  //   } else {
  //     dispatch(updateCart(customerId.current, productId, prevCount + 1));
  //   }
  // };

  // const onDecrease = (productId: number, prevCount: number): void => {
  //   if (isNaN(customerId.current) || customerId.current === 0) {
  //     dispatch(updateCartItem(productId, prevCount - 1));
  //   } else {
  //     dispatch(updateCart(customerId.current, productId, prevCount - 1));
  //   }
  // };

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
          router.push("/order");
        } else if (result.isDenied) {
          dispatch(returnToCartPage());
          router.push("/login");
        }
      });
    } else {
      router.push("/order");
    }
  };

  return (
    <div className="container mt-5 pb-5" style={{ minHeight: "350px" }}>
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
                            {cartItem.productPrice.toLocaleString("ko-KR")} ???
                          </p>
                          <p className="card-text"></p>
                        </div>
                      </div>
                      <div className="col-1 mt-3 text-center">
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
                      <div className="col-3">
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
                  </div>
                );
              })}
              <div className="row">
                <div className="col-9">
                  <p className="h5 text-right">
                    ??????: <span>{totalPrice.toLocaleString("ko-KR")} ???</span>
                  </p>
                </div>
                <div className="col-3">
                  <div className="form-row">
                    <button
                      className="btn btn-success"
                      onClick={onClickHandler}
                    >
                      <FontAwesomeIcon className="mr-2" icon={faShoppingBag} />{" "}
                      ????????????
                    </button>
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
