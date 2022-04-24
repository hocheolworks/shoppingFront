import React, { ChangeEvent, FC, FormEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { RouteComponentProps } from 'react-router-dom';

import {
  fetchProduct,
  fetchProducts,
} from '../../../redux/thunks/product-thunks';
import { formReset, updateProduct } from '../../../redux/thunks/admin-thunks';
import { AppStateType } from '../../../redux/reducers/root-reducer';
import { Product, ProductErrors } from '../../../types/types';
import ToastShow from '../../../component/Toasts/ToastShow';

const EditProduct: FC<RouteComponentProps<{ id: string }>> = ({ match }) => {
  const dispatch = useDispatch();
  const productData: Partial<Product> = useSelector(
    (state: AppStateType) => state.product.product
  );
  const errors: Partial<ProductErrors> = {};
  const isProductEdited: boolean = useSelector(
    (state: AppStateType) => state.admin.isProductEdited
  );
  const [product, setProduct] = useState<Partial<Product>>(productData);
  const [showToast, setShowToast] = useState(false);

  const {
    productNameError,
    productMinimumEAError,
    productPriceError,
    productDescriptionError,
    productImageFileError,
    customerRoleError,
  } = errors;

  const {
    id,
    productName,
    productDescription,
    productMinimumEA,
    productPrice,
  } = product;

  useEffect(() => {
    dispatch(fetchProduct(parseInt(match.params.id)));
  }, []);

  useEffect(() => {
    setProduct(productData);
    if (isProductEdited) {
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        dispatch(formReset());
      }, 5000);
      window.scrollTo(0, 0);
      dispatch(fetchProducts());
    }
  }, [productData]);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    // event.preventDefault();
    // const bodyFormData: FormData = new FormData();
    // bodyFormData.append("file", file);
    // bodyFormData.append(
    //   "product",
    //   new Blob(
    //     [
    //       JSON.stringify({
    //         id,
    //         productTitle,
    //         productr,
    //         year,
    //         country,
    //         type,
    //         volume,
    //         productGender,
    //         fragranceTopNotes,
    //         fragranceMiddleNotes,
    //         fragranceBaseNotes,
    //         filename,
    //         price,
    //       }),
    //     ],
    //     { type: "application/json" }
    //   )
    // );
    // dispatch(updateProduct(bodyFormData));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, files } = event.target;
    if (files) {
      setProduct({ ...product, [name]: files[0] });
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  return (
    <>
      <ToastShow
        showToast={showToast}
        message={'Product successfully edited!'}
      />
      <div className="container">
        <h4>
          <FontAwesomeIcon className="mr-2" icon={faEdit} />
          상품 수정
        </h4>
        <form onSubmit={onFormSubmit}>
          <div className="row mt-5">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  상품명:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      productNameError
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    name="productName"
                    value={productName}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{productNameError}</div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  최소 주문 수량:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    className={
                      productMinimumEAError
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    name="productMinimumEA"
                    value={productMinimumEA}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    {productMinimumEAError}
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  가격:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="number"
                    className={
                      productPriceError
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    name="productPrice"
                    value={productPrice}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{productPriceError}</div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  상품 설명:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      productDescriptionError
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    name="productDescription"
                    value={productDescription}
                    onChange={handleInputChange}
                  />

                  <div className="invalid-feedback">
                    {productDescriptionError}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              {/* <img src={filename} className="rounded mx-auto w-100 mb-2" /> */}
              <input type="file" name="file" onChange={handleFileChange} />
            </div>
          </div>
          <button type="submit" className="btn btn-dark">
            <FontAwesomeIcon className="mr-2" icon={faEdit} />
            Edit
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
