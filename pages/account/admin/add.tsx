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
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ToastShow from '../../../src/component/Toasts/ToastShow';
import { addProduct, formReset } from '../../../src/redux/thunks/admin-thunks';
import { AppStateType } from '../../../src/redux/reducers/root-reducer';
import { Customer, FCinLayout, ProductErrors } from '../../../src/types/types';
import { fetchProducts } from '../../../src/redux/thunks/product-thunks';
import { isValidNumber } from '../../../src/utils/functions';
import { addProductFailure } from '../../../src/redux/actions/admin-actions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import AccountLayout from '../../../src/component/AccountLayout/AccountLayout';

const MySwal = withReactContent(Swal);

type InitialStateType = {
  productName: string;
  productMinimumEA: number;
  productDescription: string;
  productPrice: number;
  file: string | Blob;
};

const AddProduct: FCinLayout = () => {
  const dispatch = useDispatch();

  const customer: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const customerId: number = parseInt(localStorage.getItem('id') as string);

  const isProductAdded: boolean = useSelector(
    (state: AppStateType) => state.admin.isProductAdded
  );
  const errors: Partial<ProductErrors> = useSelector(
    (state: AppStateType) => state.admin.errors
  );

  const initialState: InitialStateType = {
    productName: '',
    productMinimumEA: 0,
    productDescription: '',
    productPrice: 0,
    file: '',
  };

  const [
    { productName, productMinimumEA, productDescription, productPrice, file },
    setState,
  ] = useState(initialState);
  const [showToast, setShowToast] = useState(false);

  const {
    productNameError,
    productMinimumEAError,
    productDescriptionError,
    productPriceError,
    productImageFileError,
    customerRoleError,
  } = errors;

  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (Boolean(customerRoleError)) {
      MySwal.fire({
        title: `<strong>상품 추가 실패</strong>`,
        html: `<i>관리자 권한이 필요합니다.</i>`,
        icon: 'error',
      });
    }
  }, []);

  useEffect(() => {
    if (isProductAdded) {
      setState({ ...initialState });

      if (fileInput.current !== null) fileInput.current.value = '';

      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        dispatch(formReset());
      }, 5000);
      window.scrollTo(0, 0);
      dispatch(fetchProducts());
    }
  }, [isProductAdded]);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (
      !Boolean(productName) ||
      !Boolean(productDescription) ||
      !Boolean(productMinimumEA) ||
      !Boolean(productPrice) ||
      !isValidNumber(productMinimumEA) ||
      productMinimumEA < 1 ||
      !isValidNumber(productPrice) ||
      productPrice < 0 ||
      !Boolean(file)
    ) {
      const productError: ProductErrors = {
        productNameError: '',
        productDescriptionError: '',
        productMinimumEAError: '',
        productPriceError: '',
        productImageFileError: '',
        customerRoleError: '',
      };

      if (!Boolean(productName)) {
        productError.productNameError = '상품명은 필수 입니다.';
      }

      if (!Boolean(productDescription)) {
        productError.productDescriptionError = '상품 설명은 필수 입니다.';
      }

      if (!Boolean(productMinimumEA) || !isValidNumber(productMinimumEA)) {
        productError.productMinimumEAError = '최소 주문 수량은 필수 입니다.';
      } else if (productMinimumEA < 1) {
        productError.productMinimumEAError =
          '최소 주문 수량은 0보다 큰 숫자여야 합니다.';
      }

      if (!Boolean(productPrice) || !isValidNumber(productPrice)) {
        productError.productPriceError = '상품 가격은 필수 입니다.';
      } else if (productPrice < 0) {
        productError.productPriceError = '상품 가격은 0보다 작을 수 없습니다.';
      }

      if (!Boolean(file)) {
        productError.productImageFileError = '상품 이미지는 필수 입니다.';
      }

      dispatch(addProductFailure(productError));
      return;
    }

    const bodyFormData: FormData = new FormData();
    bodyFormData.append('file', file as string);
    bodyFormData.append('productName', productName);
    bodyFormData.append('productMinimumEA', productMinimumEA.toString());
    bodyFormData.append('productDescription', productDescription);
    bodyFormData.append('productPrice', productPrice.toString());
    if (customerId) {
      bodyFormData.append('customerId', customerId.toString());
    }

    dispatch(addProduct(bodyFormData));
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>
  ): void => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (event: any): void => {
    setState((prevState) => ({ ...prevState, file: event.target.files[0] }));
  };

  return (
    <>
      <ToastShow
        showToast={showToast}
        message={'Product successfully added!'}
      />
      <div className="container">
        <h4>
          <FontAwesomeIcon className="mr-2" icon={faPlusSquare} />
          상품 추가하기
        </h4>
        <br />
        <form onSubmit={onFormSubmit}>
          <div className="form row">
            <div className="col">
              <label>상품명: </label>
              <input
                type="text"
                className={
                  productNameError ? 'form-control is-invalid' : 'form-control'
                }
                name="productName"
                value={productName}
                placeholder="상품명을 입력하세요"
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productNameError}</div>
            </div>
            <div className="col">
              <label>주문 최소 수량: </label>
              <input
                type="number"
                className={
                  productMinimumEAError
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                name="productMinimumEA"
                value={productMinimumEA}
                placeholder="최소 주문 수량을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productMinimumEAError}</div>
            </div>
          </div>
          <div className="form row mt-3">
            <div className="col">
              <label>설명: </label>
              <input
                type="text"
                className={
                  productDescriptionError
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                name="productDescription"
                value={productDescription}
                placeholder="상품 설명을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productDescriptionError}</div>
            </div>
            <div className="col">
              <label>가격: </label>
              <input
                type="number"
                className={
                  productPriceError ? 'form-control is-invalid' : 'form-control'
                }
                name="productPrice"
                value={productPrice}
                placeholder="가격을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productPriceError}</div>
            </div>
          </div>
          <div className="form row mt-3"></div>
          <div className="form row mt-3"></div>
          <div className="form row mt-3"></div>
          <div className="form row mt-3">
            <div className="col" style={{ marginTop: '35px' }}>
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
              />
              <div className="invalid-feedback">{productImageFileError}</div>
            </div>
          </div>
          <button type="submit" className="btn btn-dark mt-3">
            <FontAwesomeIcon className="mr-2" icon={faPlusSquare} />
            Add
          </button>
        </form>
      </div>
    </>
  );
};

AddProduct.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default AddProduct;
