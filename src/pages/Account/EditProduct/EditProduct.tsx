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
import { Product } from '../../../types/types';
import ToastShow from '../../../component/Toasts/ToastShow';

type ProductErrors = {
  productTitleError: string;
  productrError: string;
  yearError: string;
  countryError: string;
  typeError: string;
  volumeError: string;
  productGenderError: string;
  fragranceTopNotesError: string;
  fragranceMiddleNotesError: string;
  fragranceBaseNotesError: string;
  priceError: string;
};

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
    productTitleError,
    productrError,
    yearError,
    countryError,
    typeError,
    volumeError,
    productGenderError,
    fragranceTopNotesError,
    fragranceMiddleNotesError,
    fragranceBaseNotesError,
    priceError,
  } = errors;

  // const {
  //   id,
  //   productTitle,
  //   productr,
  //   year,
  //   country,
  //   type,
  //   volume,
  //   productGender,
  //   fragranceTopNotes,
  //   fragranceMiddleNotes,
  //   fragranceBaseNotes,
  //   price,
  //   filename,
  //   file,
  // } = product;

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
          Edit product
        </h4>
        <form onSubmit={onFormSubmit}>
          <div className="row mt-5">
            <div className="col-md-6">
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Product title:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      productTitleError
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    name="productTitle"
                    // value={productTitle}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{productTitleError}</div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Brand:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      productrError ? 'form-control is-invalid' : 'form-control'
                    }
                    name="productr"
                    // value={productr}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{productrError}</div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Release year:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      yearError ? 'form-control is-invalid' : 'form-control'
                    }
                    name="year"
                    // value={year}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{yearError}</div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Country:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      countryError ? 'form-control is-invalid' : 'form-control'
                    }
                    name="country"
                    // value={country}
                    onChange={handleInputChange}
                  />

                  <div className="invalid-feedback">{countryError}</div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Product type:{' '}
                </label>
                <div className="col-sm-8">
                  <select
                    name="type"
                    className={
                      typeError ? 'form-control is-invalid' : 'form-control'
                    }
                    onChange={handleInputChange}
                  >
                    {/* {productData.type === "Eau de Parfum" ? (
                      <>
                        <option value={productData.type}>
                          {productData.type}
                        </option>
                        <option value="Eau de Toilette">Eau de Toilette</option>
                      </>
                    ) : (
                      <>
                        <option value={productData.type}>
                          {productData.type}
                        </option>
                        <option value="Eau de Parfum">Eau de Parfum</option>
                      </>
                    )} */}
                  </select>
                  <div className="invalid-feedback">{typeError}</div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Volume:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      volumeError ? 'form-control is-invalid' : 'form-control'
                    }
                    name="volume"
                    // value={volume}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{volumeError}</div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Gender:{' '}
                </label>
                <div className="col-sm-8">
                  <select
                    name="productGender"
                    className={
                      productGenderError
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    onChange={handleInputChange}
                  >
                    {/* {productData.productGender === "male" ? (
                      <>
                        <option value={productData.productGender}>
                          {productData.productGender}
                        </option>
                        <option value="female">female</option>
                      </>
                    ) : (
                      <>
                        <option value={productData.productGender}>
                          {productData.productGender}
                        </option>
                        <option value="male">male</option>
                      </>
                    )} */}
                  </select>
                  <div className="invalid-feedback">{productGenderError}</div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Top notes:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      fragranceTopNotesError
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    name="fragranceTopNotes"
                    // value={fragranceTopNotes}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    {fragranceTopNotesError}
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Heart notes:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      fragranceMiddleNotesError
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    name="fragranceMiddleNotes"
                    // value={fragranceMiddleNotes}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    {fragranceMiddleNotesError}
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Base notes:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      fragranceBaseNotesError
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    name="fragranceBaseNotes"
                    // value={fragranceBaseNotes}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">
                    {fragranceBaseNotesError}
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <label className="col-sm-4 col-form-label font-weight-bold">
                  Price:{' '}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    className={
                      priceError ? 'form-control is-invalid' : 'form-control'
                    }
                    name="price"
                    // value={price}
                    onChange={handleInputChange}
                  />
                  <div className="invalid-feedback">{priceError}</div>
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
