import React, { FC } from 'react';
import StarRatingComponent from 'react-star-rating-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

import { Review } from '../../types/types';
import usePagination from '../../component/Pagination/usePagination';
import PaginationItem from '../../component/Pagination/PaginationItem';

type PropType = {
  data: Array<Review>;
  itemsPerPage: number;
  startFrom?: number;
};

const ProductReview: FC<PropType> = ({ data, itemsPerPage, startFrom }) => {
  const { slicedData, pagination, prevPage, nextPage, changePage } =
    usePagination({ itemsPerPage, data, startFrom });

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
                        <b>{'****'}</b>
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
                    <div className="col-md-9">
                      <p>{review.reviewMessage}</p>
                    </div>
                  </div>
                  <hr />
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
