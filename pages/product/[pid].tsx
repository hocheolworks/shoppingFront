import React, { FC, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faEraser,
  faPaperPlane,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import StarRatingComponent from "react-star-rating-component";
import Head from "next/head";
import { resetForm } from "../../src/redux/thunks/customer-thunks";
import { AppStateType } from "../../src/redux/reducers/root-reducer";
import {
  CartItem,
  CartItemNonMember,
  Customer,
  Product,
  Review,
  ReviewData,
  ReviewError,
} from "../../src/types/types";
import Spinner from "../../src/component/Spinner/Spinner";
import ProductReview from "./review";
import ScrollButton from "../../src/component/ScrollButton/ScrollButton";
import {
  addReviewToProduct,
  fetchIsPurchased,
  fetchProduct,
  removeReviewToProduct,
} from "../../src/redux/thunks/product-thunks";
import RequestService from "../../src/utils/request-service";
import {
  fetchCart,
  insertCart,
  updateCart,
} from "../../src/redux/thunks/cart-thunks";
import StarRating from "../../src/component/StarRating/StarRating";
import { API_BASE_URL } from "../../src/utils/constants/url";
import { GetServerSideProps, GetStaticPaths, GetStaticProps } from "next";
import axios from "axios";
import { reloadSuccess } from "../../src/redux/actions/customer-actions";
import {
  addCartItem,
  fetchCartSuccess,
  returnToCartPage,
  updateCartItem,
} from "../../src/redux/actions/cart-actions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

type ProductDetailProps = {
  product: Product;
};

const ProductDetail: FC<ProductDetailProps> = ({ product }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { pid } = router.query;
  // console.log(product);

  function priceSetter(ea: number) {
    if (ea <= parseInt(product.productEA1)) {
      return product.productPrice1;
    } else if (
      ea <= parseInt(product.productEA2) &&
      ea >= parseInt(product.productEA1) + 1
    ) {
      return product.productPrice2;
    } else if (
      ea <= parseInt(product.productEA3) &&
      ea >= parseInt(product.productEA2) + 1
    ) {
      return product.productPrice3;
    } else if (
      ea <= parseInt(product.productEA4) &&
      ea >= parseInt(product.productEA3) + 1
    ) {
      return product.productPrice4;
    } else if (
      ea <= parseInt(product.productEA5) &&
      ea >= parseInt(product.productEA4) + 1
    ) {
      return product.productPrice5;
    } else {
      return false;
    }
  }

  const isLoggedIn: boolean = useSelector(
    (state: AppStateType) => state.customer.isLoggedIn
  );

  const reviews: Array<Review> = useSelector(
    (state: AppStateType) => state.product.reviews
  );
  const errors: Partial<ReviewError> = useSelector(
    (state: AppStateType) => state.customer.reviewErrors
  );
  const isReviewAdded: boolean = useSelector(
    (state: AppStateType) => state.customer.isReviewAdded
  );

  const isReviewDeleted: boolean = useSelector(
    (state: AppStateType) => state.customer.isReviewDeleted
  );

  const loading: boolean = useSelector(
    (state: AppStateType) => state.product.isProductLoading
  );

  const cart: Array<CartItem | CartItemNonMember> = useSelector(
    (state: AppStateType) => state.cart.cartItems
  );

  const customer: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const isPurchased: boolean = useSelector(
    (state: AppStateType) => state.product.isPurchased
  );

  const [isCartExist, setIsCartExist] = useState<boolean>(false);
  const [count, setCount] = useState<number>(0);
  const [author, setAuthor] = useState<string>(
    String(customer.customerEmail).split("@")[0]
  );
  const [message, setMessage] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const { authorError, messageError, ratingError } = errors;

  useEffect(() => {
    dispatch(resetForm());
    dispatch(fetchIsPurchased(parseInt(pid as string), customer.id));
    if (isLoggedIn) {
      dispatch(fetchCart(parseInt(sessionStorage.getItem("id") as string)));
    }
  }, []);

  useEffect(() => {
    if (cart === undefined || cart === null || cart.length === 0)
      setIsCartExist(false);
    else {
      setIsCartExist(
        cart.findIndex(
          (value: CartItem | CartItemNonMember) =>
            value.productId === parseInt(pid as string)
        ) !== -1
      );
    }
  }, [cart]);

  useEffect(() => {
    if (isReviewAdded || isReviewDeleted) {
      dispatch(reloadSuccess());
      router.reload();
    }
  }, [isReviewAdded, isReviewDeleted]);

  useEffect(() => {
    setCount(product.productMinimumEA as number);
    setMessage("");
    setRating(5);
  }, [reviews]);

  const addToCart = (): void => {
    const productId: number = product.id as number;
    let customerId: number | undefined;

    if (typeof window !== "undefined") {
      customerId = parseInt(sessionStorage.getItem("id") as string);
    }
    if (count <= 0) {
      MySwal.fire({
        title: `<strong>????????? ???????????????.</strong>`,
        html: `<i><b>????????? ??????????????????!</b><br> </i>`,
        icon: "error",
      });
      return;
    }

    const finalPrice = priceSetter(count);
    if (!finalPrice) {
      MySwal.fire({
        title: `<strong>?????? ????????? ??????????????????!</strong>`,
        html: `<i><b>?????? ????????? ??????<br> ?????? ) 010-4826-0519</b><br> </i>`,
        icon: "info",
      });
      return;
    }

    if (!Boolean(customerId)) {
      // ???????????? ??????,
      if (isCartExist) {
        // ????????? ?????? ?????? ????????? ???????????????,
        // MySwal.fire({
        //   title: `<strong>??????????????? ?????? ?????? ???????????????.</strong>`,
        //   html: `<i>${count}?????? ?????????????????????????</i>`,
        //   icon: "question",
        //   showConfirmButton: true,
        //   showCancelButton: true,
        //   confirmButtonText: "??????",
        //   cancelButtonText: "??????",
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     const prevCartItem: CartItem | CartItemNonMember = cart.find(
        //       (val: CartItem | CartItemNonMember) =>
        //         val.productId === parseInt(pid as string)
        //     ) as CartItem | CartItemNonMember;

        //     dispatch(
        //       updateCartItem(
        //         parseInt(pid as string),
        //         prevCartItem.productCount + count
        //       )
        //     );
        //     router.push("/cart");
        //   } else if (result.isDenied) {
        //     return;
        //   }
        // });
        MySwal.fire({
          title: `<strong>?????? ??????????????? ??????????????????!</strong>`,
          html: `<i><b>?????? ????????? ?????????<br>?????????????????? ?????? ??? ??????????????????!</b> </i>`,
          icon: "error",
        });
        router.push("/cart");
      } else {
        MySwal.fire({
          title: `<strong>?????? ??????</strong>`,
          html: `<i><b>${count}?????? ??????????????? ?????? ${finalPrice}??? ?????????.</i>`,
          icon: "question",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "??????",
          cancelButtonText: "??????",
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(
              addCartItem({
                productId: product.id,
                product: product,
                productCount: count,
                productPrice: finalPrice,
                isPrint: false,
              })
            );
            router.push("/cart");
          } else if (result.isDenied) {
            return;
          }
        });
      }
    } else {
      // ??????????????? ?????? ??????
      if (isCartExist) {
        // // ????????? ?????? ?????? ????????? ???????????????,
        // MySwal.fire({
        //   title: `<strong>??????????????? ?????? ?????? ???????????????.</strong>`,
        //   html: `<i>${count}?????? ?????????????????????????</i>`,
        //   icon: "question",
        //   showConfirmButton: true,
        //   showCancelButton: true,
        //   confirmButtonText: "??????",
        //   cancelButtonText: "??????",
        // }).then((result) => {
        //   if (result.isConfirmed) {
        //     const prevCartItem: CartItem | CartItemNonMember = cart.find(
        //       (val: CartItem | CartItemNonMember) =>
        //         val.productId === parseInt(pid as string)
        //     ) as CartItem | CartItemNonMember;

        //     dispatch(
        //       updateCart(
        //         customerId as number,
        //         productId,
        //         prevCartItem.productCount + count
        //       )
        //     );
        //     router.push("/cart");
        //   } else if (result.isDenied) {
        //     return;
        //   }
        // });
        MySwal.fire({
          title: `<strong>?????? ??????????????? ??????????????????!</strong>`,
          html: `<i><b>?????? ????????? ?????????<br>?????????????????? ?????? ??? ??????????????????!</b> </i>`,
          icon: "error",
        });
        router.push("/cart");
      } else {
        MySwal.fire({
          title: `<strong>?????? ??????</strong>`,
          html: `<i><b>${count}?????? ??????????????? ?????? ${finalPrice}??? ?????????.</i>`,
          icon: "question",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "??????",
          cancelButtonText: "??????",
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(
              insertCart(customerId as number, productId, count, finalPrice)
            );
            router.push("/cart");
          } else if (result.isDenied) {
            return;
          }
        });
      }
    }
  };

  const countOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const onlyNumber = value.replace(/[^0-9]/g, "").substring(0, 10);
    const num = parseInt(onlyNumber);
    setCount(num);
  };

  const addReview = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const review: ReviewData = {
      productId: parseInt(pid as string),
      author,
      message,
      rating,
      customerId: customer.id,
    };
    dispatch(addReviewToProduct(review));
  };

  const renderStars = (productRating: number = 5): JSX.Element => {
    return (
      <>
        <StarRatingComponent
          renderStarIconHalf={() => (
            <img
              src={"/image/star-half.svg"}
              alt="halfStar"
              style={{ width: "14.5px", marginBottom: "2px" }}
            />
          )}
          renderStarIcon={() => (
            <FontAwesomeIcon className="fa-sm" icon={faStar} />
          )}
          name={"star"}
          starCount={5}
          editing={false}
          value={productRating}
        />
      </>
    );
  };

  return (
    <>
      <Head>
        <title>{`${product.productName} | ????????? ????????????`}</title>
        <meta
          name="keyword"
          content={`${product.productName} ,?????????, ?????? ??????, ?????????, ?????? ??????, ????????? ??????, ?????????`}
        ></meta>{" "}
        <meta
          name="description"
          content="?????? ?????? ????????? | ?????? ????????? ?????? ????????? ?????? | ?????? ?????? | ?????? ?????? ??? ?????? ?????? | 60 * 42 * 22(cm) ?????????"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta
          property="og:title"
          content={product.productName || "???????????? - ?????? ?????? ??????"}
        />
        <meta
          property="og:description"
          content={`?????? ?????? - ?????? ????????? ?????? ????????? ??????, ?????? ??????, ?????? ?????? ??? ?????? ??????`}
        ></meta>
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://jinsoltrade.com/product/${product.id}`}
        />
        <meta property="og:image" content={product.productImageFilepath} />
        <meta property="og:article:author" content="????????????" />
      </Head>
      <div className="container mt-5 pb-5" id="mid">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <ScrollButton />
            <div className="row">
              <div className="col-md-5">
                <div>
                  <img
                    src={`${product.productImageFilepath}`}
                    className="rounded mx-auto w-100"
                  />
                </div>
              </div>
              <div className="col-md-7">
                <h2>{product.productName}</h2>
                <p>
                  ?????? ??????: <span>{product.id}</span>
                </p>
                <div className="row">
                  <div className="col-md-4">
                    {renderStars(
                      product.productRating === 0 ? 0 : product.productRating
                    )}
                  </div>
                  <div className="col-md-8">
                    <span style={{ paddingBottom: "50px" }}>
                      {product.productRatingCount}?????? ??????
                    </span>
                  </div>
                </div>
                <p style={{ color: "#54C0A1" }}>?????? ??????</p>
                <div className="row ml-1">
                  <h4 className="mr-5">
                    <span>
                      {product.productPrice?.toLocaleString("ko-KR")}???~
                    </span>
                  </h4>
                </div>
                <div className="row ml-1" style={{ alignItems: "center" }}>
                  <span style={{ marginRight: "5px" }}>??????: </span>
                  <input
                    type="number"
                    min={product.productMinimumEA}
                    max="1000000000"
                    step="1"
                    maxLength={20}
                    style={{
                      width: "120px",
                      height: "30px",
                    }}
                    value={count}
                    onChange={countOnChange}
                  ></input>
                  <button
                    type="submit"
                    className="btn btn-success mx-3"
                    onClick={addToCart}
                  >
                    <FontAwesomeIcon className="ml-1 fa-lg" icon={faCartPlus} />{" "}
                    ???????????? ??????
                  </button>
                  <p
                    className="mb-0 fw-lighter mt-2"
                    style={{ fontSize: "9px" }}
                  >
                    *????????? 10% ??????, 10?????? ?????? ????????? ????????? ??????
                  </p>
                </div>
                <br />
                <div className="row ml-1" style={{ alignItems: "center" }}>
                  <span>?????? ????????? ??????</span>
                </div>
                <table className="table">
                  <tbody>
                    {product.productEA1 !== 0 ? (
                      <tr>
                        <td>1??? ~ {product.productEA1}???</td>
                        <td>
                          {product.productPrice1 === "?????? ??? ?????? ??????" ? (
                            <span>?????? ??? ?????? ??????</span>
                          ) : (
                            <span>{product.productPrice1}???</span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <div></div>
                    )}
                    {product.productEA2 !== 0 ? (
                      <tr>
                        <td>
                          {product.productEA1 + 1}??? ~ {product.productEA2}???
                        </td>
                        <td>
                          {product.productPrice2 === "?????? ??? ?????? ??????" ? (
                            <span>?????? ??? ?????? ??????</span>
                          ) : (
                            <span>{product.productPrice2}???</span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <div></div>
                    )}
                    {product.productEA3 !== 0 ? (
                      <tr>
                        <td>
                          {product.productEA2 + 1}??? ~ {product.productEA3}???
                        </td>
                        <td>
                          {product.productPrice3 === "?????? ??? ?????? ??????" ? (
                            <span>?????? ??? ?????? ??????</span>
                          ) : (
                            <span>{product.productPrice3}???</span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <div></div>
                    )}
                    {product.productEA4 !== 0 ? (
                      <tr>
                        <td>
                          {product.productEA3 + 1}??? ~ {product.productEA4}???
                        </td>
                        <td>
                          {product.productPrice4 === "?????? ??? ?????? ??????" ? (
                            <span>?????? ??? ?????? ??????</span>
                          ) : (
                            <span>{product.productPrice4}???</span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <div></div>
                    )}
                    {product.productEA5 !== 0 ? (
                      <tr>
                        <td>
                          {product.productEA4 + 1}??? ~ {product.productEA5}???
                        </td>
                        <td>
                          {product.productPrice5 === "?????? ??? ?????? ??????" ? (
                            <span>?????? ??? ?????? ??????</span>
                          ) : (
                            <span>{product.productPrice5}???</span>
                          )}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td>{product.productEA3 + 1}???~</td>
                        <td>
                          <span>?????? ??? ?????? ??????</span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <hr />
            <div className="mt-5mw -100">
              <h3 className="text-center mb-5">?????? ??????</h3>
              <div
                className="text-center mb-5"
                dangerouslySetInnerHTML={{
                  __html: product.productDescription.replaceAll(
                    "<img ",
                    '<img style="max-width:100%" alt="product_image"'
                  ),
                }}
              ></div>
            </div>
            <div className="mt-5">
              <h3 className="text-center mt-5 mb-5 border-top">
                <br></br>??????
              </h3>
              <div id="review-table">
                <ProductReview
                  data={product.reviews}
                  itemsPerPage={5}
                  dispatch={dispatch}
                  product={product}
                />
              </div>
              {isPurchased && (
                <form onSubmit={addReview}>
                  <div className="form-group border mt-5">
                    <div className="mx-3 my-3" style={{ width: "100%" }}>
                      <div className="row" id="review-row">
                        <div className="col-md-4">
                          <label>
                            <span className="text-danger">
                              <b>*</b>
                            </span>{" "}
                            ?????????
                          </label>
                          <input
                            type="text"
                            className={
                              authorError
                                ? "form-control is-invalid"
                                : "form-control"
                            }
                            name="author"
                            value={author}
                            readOnly={true}
                          />
                          <div className="invalid-feedback">{authorError}</div>
                          <label>
                            <span className="text-danger">
                              <b>*</b>
                            </span>{" "}
                            ??????
                          </label>
                        </div>
                        <div className="col-md-8">
                          <label>
                            <span className="text-danger">
                              <b>*</b>
                            </span>{" "}
                            ??????
                          </label>
                          <div id="star-rating">
                            <StarRatingComponent
                              name="star"
                              starCount={5}
                              value={rating}
                              onStarClick={(value) => setRating(value)}
                              renderStarIcon={() => (
                                <FontAwesomeIcon
                                  className="fa-sm"
                                  icon={faStar}
                                />
                              )}
                            />
                            <div className="invalid-feedback d-block">
                              {ratingError}
                            </div>
                          </div>
                        </div>
                      </div>
                      <textarea
                        rows={4}
                        className={
                          messageError
                            ? "form-control is-invalid"
                            : "form-control"
                        }
                        name="message"
                        value={message}
                        style={{ width: "100%" }}
                        onChange={(event) => setMessage(event.target.value)}
                      />
                      <div className="invalid-feedback">{messageError}</div>
                      <button type="submit" className="btn btn-dark mt-3">
                        <FontAwesomeIcon className="mr-2" icon={faPaperPlane} />
                        ?????? ?????????
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await RequestService.get(`/product/${context.params?.pid}`);
  const product = response.data;
  return { props: { product } };
};

export default ProductDetail;
