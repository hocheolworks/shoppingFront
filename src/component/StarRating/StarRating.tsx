import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import StarRatingComponent from 'react-star-rating-component';

const StarRating: FC<{ productRating: number }> = ({ productRating }) => {
  return (
    <>
      <StarRatingComponent
        renderStarIconHalf={() => {
          return (
            <img
              src={'/image/star-half.svg'}
              alt="halfStar"
              style={{ width: '13px' }}
            />
          );
        }}
        renderStarIcon={() => (
          <FontAwesomeIcon className="fa-xs" icon={faStar} />
        )}
        name={'star'}
        starCount={5}
        editing={false}
        value={productRating === 0 ? 0 : productRating}
      />
    </>
  );
};

export default StarRating;
