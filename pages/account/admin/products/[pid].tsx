import React, {
  ChangeEvent,
  FC,
  FormEvent,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import {
  fetchProduct,
  fetchProducts,
} from '../../../../src/redux/thunks/product-thunks';
import {
  formReset,
  updateProduct,
} from '../../../../src/redux/thunks/admin-thunks';
import { AppStateType } from '../../../../src/redux/reducers/root-reducer';
import {
  FCinLayout,
  Product,
  ProductErrors,
} from '../../../../src/types/types';
import ToastShow from '../../../../src/component/Toasts/ToastShow';
import { makeImageUrl } from '../../../../src/utils/functions';
import Spinner from '../../../../src/component/Spinner/Spinner';
import AccountLayout from '../../../../src/component/AccountLayout/AccountLayout';

const EditProduct: FCinLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { pid } = router.query;
  const customerId: number = parseInt(localStorage.getItem('id') as string);
  const productData: Partial<Product> = useSelector(
    (state: AppStateType) => state.product.product
  );
  const errors: Partial<ProductErrors> = {};
  const isProductEdited: boolean = useSelector(
    (state: AppStateType) => state.admin.isProductEdited
  );
  const [product, setProduct] = useState<Partial<Product>>(productData);
  const [loading, setLoading] = useState<boolean>(true);
  const [showToast, setShowToast] = useState(false);
  const [file, setFile] = useState<any>();
  const [imgSrc, setImgSrc] = useState<any>();
  const {
    productNameError,
    productMinimumEAError,
    productPriceError,
    productDescriptionError,
    productImageFileError,
    customerRoleError,
  } = errors;

  const {
    productName,
    productDescription,
    productMinimumEA,
    productPrice,
    productImageFilepath,
  } = product;

  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchProduct(parseInt(pid as string)));
  }, []);

  useEffect(() => {
    setLoading(productData.id !== parseInt(pid as string));
  }, [productData]);

  useEffect(() => {
    setProduct(productData);
    if (isProductEdited) {
      if (fileInput.current !== null) fileInput.current.value = '';
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
    event.preventDefault();
    const bodyFormData: FormData = new FormData();
    if (file) {
      bodyFormData.append('file', file as string);
    }
    if (productName) {
      bodyFormData.append('productName', productName);
    }
    if (productMinimumEA) {
      bodyFormData.append('productMinimumEA', productMinimumEA.toString());
    }
    if (productDescription) {
      bodyFormData.append('productDescription', productDescription);
    }
    if (productPrice) {
      bodyFormData.append('productPrice', productPrice.toString());
    }
    dispatch(updateProduct(parseInt(pid as string), customerId, bodyFormData));
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const { name, files } = event.target;
    if (files) {
      // setProduct({ ...product, [name]: files[0] });
      setFile(files[0]);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImgSrc(e.target?.result);
      };
      if (files[0]) reader.readAsDataURL(files[0]);
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
      {loading ? (
        <Spinner />
      ) : (
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
                <div className="col-md-7">
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
                      <div className="invalid-feedback">
                        {productPriceError}
                      </div>
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
                <div className="col-md-5">
                  <img
                    src={
                      file
                        ? imgSrc
                        : makeImageUrl(productImageFilepath as string)
                    }
                    className="rounded mx-auto w-100 mb-2"
                    style={{ width: '180px' }}
                  />
                  <input
                    type="file"
                    className={
                      productImageFileError
                        ? 'form-control is-invalid'
                        : 'form-control'
                    }
                    style={{ height: '44px' }}
                    name="file"
                    ref={fileInput}
                    onChange={handleFileChange}
                    placeholder=""
                  />
                  <div className="invalid-feedback">
                    {productImageFileError}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-dark">
                <FontAwesomeIcon className="mr-2" icon={faEdit} />
                수정
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
};

EditProduct.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default EditProduct;
