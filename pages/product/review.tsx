import React, { Dispatch, FC, FormEvent, MouseEventHandler, useState } from "react";
import StarRatingComponent from "react-star-rating-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser, faStar } from "@fortawesome/free-solid-svg-icons";

import { Product, Review } from "../../src/types/types";
import usePagination from "../../src/component/Pagination/usePagination";
import PaginationItem from "../../src/component/Pagination/PaginationItem";

import { removeReviewToProduct } from "../../src/redux/thunks/product-thunks";

type PropType = {
  data: Array<Review>;
  itemsPerPage: number;
  startFrom?: number;
  dispatch : Dispatch<any>
  product : Partial<Product>
};
// 20220507 리뷰 삭제 만들어야함
const ProductReview: FC<PropType> = ({ data, itemsPerPage, startFrom, dispatch, product }) => {

  const { slicedData, pagination, prevPage, nextPage, changePage } =
    usePagination({ itemsPerPage, data, startFrom });

  const onClickHandler = (review: Review): void => {
    dispatch(removeReviewToProduct(review, product.id));
  }

  const authorSlice = (author: string | undefined) => {
    if (author != undefined && author.length > 4){
      let star = "*".repeat((author.length-4));
      return author.slice(0, 2) + star + author.slice(author.length-2)
    } else{
      return '*****'
    }
  }

  const createDeleteButton = (review: Review) => {
    if (typeof window !== 'undefined') {
      const author = String(window.sessionStorage.getItem('customerEmail')).split('@')[0]
      if (window.sessionStorage.getItem('customerRole') != 'ADMIN'){
        if(author != review.author) {
          return ""
        }
      }
      
      return (
        <button className="btn btn-dark" onClick={() => onClickHandler(review)}>
          <FontAwesomeIcon className="mr-2" icon={faEraser}/> 삭제
        </button>
      )
    }
  }

  return (
    <div className="container">
      <div className="row mt-3 ml-2">
        <div className="container-fluid">
          {data === undefined || data.length < 5 ? null : (
            <PaginationItem
              pagination={pagination}
              prevPage={prevPage}
              changePage={changePage}
              nextPage={nextPage}
            />
          )}
          {slicedData.length === 0 ? (
            <p className="text-center">등록된 리뷰가 없습니다.</p>
          ) : (
            slicedData.map((review: Review) => {
              return (
                <div key={review.id}>
                  <div className="form row mt-5">
                    <div className="col-md-3">
                      <p>
                        <b>
                          {authorSlice(review.author)}
                        </b>
                      </p>
                      <p>
                        {new Date(review.createdAt).toLocaleDateString() +
                          ' ' +
                          new Date(review.createdAt).toLocaleTimeString()}
                      </p>
                      <StarRatingComponent
                        name="star"
                        renderStarIcon={() => (
                          <FontAwesomeIcon className="fa-sm" icon={faStar} />
                        )}
                        starCount={5}
                        editing={false}
                        value={review.reviewRating}
                      />
                    </div>
                    <div className="col-md-9 review_container">
                      <div>
                        <p>{review.reviewMessage}</p>
                      </div>
                      <div className="items_btn">
                        <div>
                        </div>
                        <div>
                          {createDeleteButton(review)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr/>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
