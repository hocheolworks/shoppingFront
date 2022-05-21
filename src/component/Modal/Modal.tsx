import React, { FC } from "react";
import { Product } from "../../types/types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { API_BASE_URL } from "../../utils/constants/url";

type PropTypes = {
  product: Product;
  deleteProductHandler: (id: number) => void;
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>;
};

const Modal: FC<PropTypes> = ({
  product,
  deleteProductHandler,
  setModalActive,
}) => {
  return (
    <>
      <div className="modal-open">
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">상품 삭제</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setModalActive(false)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="row modal-body">
                <div className="col-md-4 d-flex justify-content-center">
                  <LazyLoadImage
                    effect="blur"
                    style={{ width: "90px" }}
                    src={`${product.productImageFilepath}`}
                  />
                </div>
                <div className="col-md-6 text-center">
                  <h6>상품 번호 : {product.id}</h6>
                  <h6>
                    {product.productName} |{" "}
                    {product.productPrice.toLocaleString("ko-kr")} 원
                  </h6>
                  <p>정말 삭제하시겠습니까?</p>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => deleteProductHandler(product.id)}
                >
                  삭제
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={() => setModalActive(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default Modal;
