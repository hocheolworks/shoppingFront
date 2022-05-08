import React, { FC, FormEvent, useEffect, useState } from "react";
import { Route, RouteComponentProps, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faPaperPlane,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import StarRatingComponent from "react-star-rating-component";

import {
  resetForm,
} from "../../redux/thunks/customer-thunks";
import { AppStateType } from "../../redux/reducers/root-reducer";
import {
  CartItem,
  Customer,
  Product,
  Review,
  ReviewData,
  ReviewError,
} from "../../types/types";
import halfStar from "../../img/star-half.svg";
import Spinner from "../../component/Spinner/Spinner";
import ProductReview from "./ProductReview";
import ScrollButton from "../../component/ScrollButton/ScrollButton";
import { addReviewToProduct, fetchIsPurchased, fetchProduct } from "../../redux/thunks/product-thunks";
import RequestService from "../../utils/request-service";
import {
  fetchCart,
  insertCart,
  updateCart,
} from "../../redux/thunks/cart-thunks";
import { API_BASE_URL } from "../../utils/constants/url";
import ReactDOM from "react-dom";

const ProductDetail: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const isLoggedIn: boolean = useSelector(
    (state: AppStateType) => state.customer.isLoggedIn
  );
  const product: Partial<Product> = useSelector(
    (state: AppStateType) => state.product.product
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
  
  const cart: Array<CartItem> = useSelector(
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
    String(customer.customerEmail).split('@')[0]
  );
  const [message, setMessage] = useState<string>("");
  const [rating, setRating] = useState<number>(0);
  const { authorError, messageError, ratingError } = errors;

  useEffect(() => {
    dispatch(fetchProduct(parseInt(match.params.id)));
    dispatch(resetForm());
    dispatch(fetchIsPurchased(parseInt(match.params.id), customer.id));
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
          (value: CartItem) => value.productId === parseInt(match.params.id)
        ) !== -1
      );
    }
  }, [cart]);

  useEffect(() => {
    setMessage("");
    setRating(5);
  }, [isReviewAdded,isReviewDeleted]);

  useEffect(() => {
    setCount(product.productMinimumEA as number);
    setMessage("");
    setRating(5);
  }, [product]);

  const addToCart = (): void => {
    const productId: number = product.id as number;
    const customerId: number | undefined = parseInt(
      sessionStorage.getItem("id") as string
    );

    if (isCartExist) {
      const prevCartItem: CartItem = cart.find(
        (val: CartItem) => val.productId === parseInt(match.params.id)
      ) as CartItem;

      dispatch(
        updateCart(customerId, productId, prevCartItem.productCount + count)
      );
    } else {
      dispatch(insertCart(customerId, productId, count));
    }

    history.push("/cart");
  };

  const countOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const onlyNumber = value.replace(/[^0-9]/g, "").substring(0, 4);
    const num = parseInt(onlyNumber);
    // if (num >= parseInt(e.target.min) && num <= parseInt(e.target.max))
    setCount(num);
  };

  // 리뷰 남기기 기능은 나중에 개발
  const addReview = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const review: ReviewData = {
      productId: parseInt(match.params.id),
      author,
      message,
      rating,
      customerId: customer.id,
    };
    dispatch(addReviewToProduct(review));
  };

  const renderStars = (productRating: number = 5): JSX.Element => {
    return (
      <StarRatingComponent
        renderStarIconHalf={() => (
          <img
            src={halfStar}
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
    );
  };

  return (
    <div className="container mt-5 pb-5">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <ScrollButton />
          <div className="row">
            <div className="col-md-5">
              <div>
                <img
                  src={`${API_BASE_URL.replace("api/v1", "")}${
                    product.productImageFilepath
                  }`}
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
                  <span>{product.productPrice?.toLocaleString("ko-KR")}원</span>
                </h4>
              </div>
              {(sessionStorage.getItem("isLoggedIn") === "true" ||
                isLoggedIn) && (
                <div className="row ml-1" style={{ alignItems: "center" }}>
                  <span style={{ marginRight: "5px" }}>수량: </span>
                  <input
                    type="number"
                    min={product.productMinimumEA}
                    max="1000"
                    step="10"
                    maxLength={4}
                    style={{
                      width: "60px",
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
                    <FontAwesomeIcon className="mr-2 fa-lg" icon={faCartPlus} />{" "}
                    장바구니 담기
                  </button>
                </div>
              )}
              <br />
              <table className="table">
                <tbody>
                  <tr>
                    <td>상품명:</td>
                    <td>{product.productName}</td>
                  </tr>
                  <tr>
                    <td>설명:</td>
                    <td>{product.productDescription}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <hr />
          <div className="mt-5">
            <h3 className="text-center mb-5">리뷰</h3>
            <Route
              exact
              component={() => (
                <ProductReview data={reviews} itemsPerPage={5} dispatch={dispatch} />
              )}
            />
            {(isPurchased) && (
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
                            <FontAwesomeIcon className="fa-sm" icon={faStar} />
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
                      messageError ? "form-control is-invalid" : "form-control"
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

export default ProductDetail;
