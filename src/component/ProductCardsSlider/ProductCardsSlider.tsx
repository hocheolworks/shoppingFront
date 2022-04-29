import React, { FC, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchProductsByIds } from '../../redux/thunks/product-thunks';
import { AppStateType } from '../../redux/reducers/root-reducer';
import { Product } from '../../types/types';
import StarRating from '../StarRating/StarRating';

const ProductCardsSlider: FC = () => {
  const dispatch = useDispatch();
  const products: Array<Product> = useSelector(
    (state: AppStateType) => state.product.products
  );
  const productsId: Array<number> = [
    26, 43, 46, 106, 34, 76, 82, 85, 27, 39, 79, 86,
  ];

  const addCarouselItems = (array: Array<Product>, counter: number) => {
    return (
      <Carousel.Item>
        <div className="card-deck">
          {array.map((product: Product) => {
            for (let i = counter; i < counter + 4; i++) {
              if (product.id === productsId[i]) {
                return (
                  <div className="card" key={product.id}>
                    <div
                      style={{
                        height: '130px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      {/* <img style={{ width: "125px" }} src={product.filename} /> */}
                    </div>
                    <div className="card-body text-center">
                      {/* <h5>{product.productTitle}</h5>
                      <h6>{product.productr}</h6>
                      <StarRating productRating={product.productRating} /> */}
                      <h6>{/* $<span>{product.price}</span>.00 */}</h6>
                      <Link href={`/product/${product.id}`}>
                        <span className="btn btn-dark">SHOW MORE</span>
                      </Link>
                    </div>
                  </div>
                );
              }
            }
          })}
        </div>
      </Carousel.Item>
    );
  };

  const settings = { controls: false };

  return (
    <div>
      <div className="container text-center my-3">
        <h3>PERSONALLY RECOMMENDED</h3>
      </div>
      <div className="container mt-5" id="indicators">
        <form method="get" action="/">
          <Carousel {...settings}>
            {addCarouselItems(products, 0)}
            {addCarouselItems(products, 4)}
            {addCarouselItems(products, 8)}
          </Carousel>
        </form>
      </div>
    </div>
  );
};

export default ProductCardsSlider;
