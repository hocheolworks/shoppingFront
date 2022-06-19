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
        title: `<strong>잘못된 입력입니다.</strong>`,
        html: `<i><b>수량을 확인해주세요!</b><br> </i>`,
        icon: "error",
      });
      return;
    }

    const finalPrice = priceSetter(count);
    if (!finalPrice) {
      MySwal.fire({
        title: `<strong>대량 구매는 문의해주세요!</strong>`,
        html: `<i><b>전국 최저가 보장<br> 문의 ) 010-4826-0519</b><br> </i>`,
        icon: "info",
      });
      return;
    }

    if (!Boolean(customerId)) {
      // 비회원일 경우,
      if (isCartExist) {
        // 카트에 이미 해당 상품이 담겨있다면,
        // MySwal.fire({
        //   title: `<strong>장바구니에 이미 있는 상품입니다.</strong>`,
        //   html: `<i>${count}개를 추가하시겠습니까?</i>`,
        //   icon: "question",
        //   showConfirmButton: true,
        //   showCancelButton: true,
        //   confirmButtonText: "계속",
        //   cancelButtonText: "취소",
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
          title: `<strong>이미 장바구니에 담겨있습니다!</strong>`,
          html: `<i><b>수량 변경을 위해선<br>장바구니에서 삭제 후 이용해주세요!</b> </i>`,
          icon: "error",
        });
        router.push("/cart");
      } else {
        MySwal.fire({
          title: `<strong>가격 안내</strong>`,
          html: `<i><b>${count}개를 구매하시면 개당 ${finalPrice}원 입니다.</i>`,
          icon: "question",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "계속",
          cancelButtonText: "취소",
        }).then((result) => {
          if (result.isConfirmed) {
            dispatch(
              addCartItem({
                productId: product.id,
                product: product,
                productCount: count,
                productPrice: finalPrice,
              })
            );
            router.push("/cart");
          } else if (result.isDenied) {
            return;
          }
        });
      }
    } else {
      // 로그인되어 있을 경우
      if (isCartExist) {
        // // 카트에 이미 해당 상품이 담겨있다면,
        // MySwal.fire({
        //   title: `<strong>장바구니에 이미 있는 상품입니다.</strong>`,
        //   html: `<i>${count}개를 추가하시겠습니까?</i>`,
        //   icon: "question",
        //   showConfirmButton: true,
        //   showCancelButton: true,
        //   confirmButtonText: "계속",
        //   cancelButtonText: "취소",
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
          title: `<strong>이미 장바구니에 담겨있습니다!</strong>`,
          html: `<i><b>수량 변경을 위해선<br>장바구니에서 삭제 후 이용해주세요!</b> </i>`,
          icon: "error",
        });
        router.push("/cart");
      } else {
        MySwal.fire({
          title: `<strong>가격 안내</strong>`,
          html: `<i><b>${count}개를 구매하시면 개당 ${finalPrice}원 입니다.</i>`,
          icon: "question",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: "계속",
          cancelButtonText: "취소",
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
                상품 번호: <span>{product.id}</span>
              </p>
              <div className="row">
                <div className="col-md-4">
                  {renderStars(
                    product.productRating === 0 ? 0 : product.productRating
                  )}
                </div>
                <div className="col-md-8">
                  <span style={{ paddingBottom: "50px" }}>
                    {product.productRatingCount}개의 리뷰
                  </span>
                </div>
              </div>
              <p style={{ color: "#54C0A1" }}>재고 있음</p>
              <div className="row ml-1">
                <h4 className="mr-5">
                  <span>
                    {product.productPrice?.toLocaleString("ko-KR")}원~
                  </span>
                </h4>
              </div>
              <div className="row ml-1" style={{ alignItems: "center" }}>
                <span style={{ marginRight: "5px" }}>수량: </span>
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
                  장바구니 담기
                </button>
                <p className="mb-0 fw-lighter mt-2" style={{ fontSize: "9px" }}>
                  *부가세 10% 별도, 10만원 이상 주문시 배송비 무료
                </p>
              </div>
              <br />
              <div className="row ml-1" style={{ alignItems: "center" }}>
                <span>구매 수량별 가격</span>
              </div>
              <table className="table">
                <tbody>
                  {product.productEA1 !== 0 ? (
                    <tr>
                      <td>1개 ~ {product.productEA1}개</td>
                      <td>
                        {product.productPrice1 === "문의 후 가격 협의" ? (
                          <span>문의 후 가격 협의</span>
                        ) : (
                          <span>{product.productPrice1}원</span>
                        )}
                      </td>
                    </tr>
                  ) : (
                    <div></div>
                  )}
                  {product.productEA2 !== 0 ? (
                    <tr>
                      <td>
                        {product.productEA1 + 1}개 ~ {product.productEA2}개
                      </td>
                      <td>
                        {product.productPrice2 === "문의 후 가격 협의" ? (
                          <span>문의 후 가격 협의</span>
                        ) : (
                          <span>{product.productPrice2}원</span>
                        )}
                      </td>
                    </tr>
                  ) : (
                    <div></div>
                  )}
                  {product.productEA3 !== 0 ? (
                    <tr>
                      <td>
                        {product.productEA2 + 1}개 ~ {product.productEA3}개
                      </td>
                      <td>
                        {product.productPrice3 === "문의 후 가격 협의" ? (
                          <span>문의 후 가격 협의</span>
                        ) : (
                          <span>{product.productPrice3}원</span>
                        )}
                      </td>
                    </tr>
                  ) : (
                    <div></div>
                  )}
                  {product.productEA4 !== 0 ? (
                    <tr>
                      <td>
                        {product.productEA3 + 1}개 ~ {product.productEA4}개
                      </td>
                      <td>
                        {product.productPrice4 === "문의 후 가격 협의" ? (
                          <span>문의 후 가격 협의</span>
                        ) : (
                          <span>{product.productPrice4}원</span>
                        )}
                      </td>
                    </tr>
                  ) : (
                    <div></div>
                  )}
                  {product.productEA5 !== 0 ? (
                    <tr>
                      <td>
                        {product.productEA4 + 1}개 ~ {product.productEA5}개
                      </td>
                      <td>
                        {product.productPrice5 === "문의 후 가격 협의" ? (
                          <span>문의 후 가격 협의</span>
                        ) : (
                          <span>{product.productPrice5}원</span>
                        )}
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td>{product.productEA3 + 1}개~</td>
                      <td>
                        <span>문의 후 가격 협의</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          <div className="mt-5mw -100">
            <h3 className="text-center mb-5">상품 설명</h3>
            <body
              className="text-center mb-5 mw-100"
              dangerouslySetInnerHTML={{
                __html: product.productDescription.replaceAll(
                  "<img ",
                  '<img style="max-width:100% "'
                ),
              }}
            ></body>
          </div>
          <div className="mt-5">
            <h3 className="text-center mt-5 mb-5 border-top">
              <br></br>리뷰
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
                  <div className="mx-3 my-3">
                    <div className="row">
                      <div className="col-md-4">
                        <label>
                          <span className="text-danger">
                            <b>*</b>
                          </span>{" "}
                          작성자
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
                          내용
                        </label>
                      </div>
                      <div className="col-md-8">
                        <label>
                          <span className="text-danger">
                            <b>*</b>
                          </span>{" "}
                          별점
                        </label>
                        <div>
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
                      style={{ resize: "none" }}
                      onChange={(event) => setMessage(event.target.value)}
                    />
                    <div className="invalid-feedback">{messageError}</div>
                    <button type="submit" className="btn btn-dark mt-3">
                      <FontAwesomeIcon className="mr-2" icon={faPaperPlane} />
                      리뷰 남기기
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await RequestService.get(`/product/${context.params?.pid}`);
  const product = response.data;
  return { props: { product } };
};

export default ProductDetail;
