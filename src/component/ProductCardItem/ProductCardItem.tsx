import React, { FC } from "react";
import Link from "next/link";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { Product } from "../../types/types";
import StarRating from "../StarRating/StarRating";
import { API_BASE_URL } from "../../utils/constants/url";

type PropsType = {
  divKey: number;
  product: Product;
  colSize: number;
  link: string;
  btnName: string;
};

const ProductCardItem: FC<PropsType> = ({
  divKey,
  product,
  colSize,
  link,
  btnName,
}) => {
  return (
    <div key={`product${divKey}`} className={`col-lg-${colSize}`}>
      <div className="card mb-5" style={{ height: "270px" }}>
        <div
          style={{
            height: "92px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <LazyLoadImage
            effect="blur"
            style={{ width: "80px", marginTop: "20px" }}
            src={`${product.productImageFilepath}`}
          />
        </div>
        <div className="card-body text-center">
          <StarRating productRating={product.productRating} />
          <h6>{product.productName}</h6>
          <h6>
            <span>{product.productPrice.toLocaleString("ko-KR")}원</span>
          </h6>
        </div>
        <div className="text-center align-items-end mb-3">
          <Link href={`${link}/${product.id}`}>
            <a className="btn btn-dark">
              <span>{btnName}</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCardItem;
