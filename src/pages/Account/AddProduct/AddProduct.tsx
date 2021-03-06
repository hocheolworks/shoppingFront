import React, {
  ChangeEvent,
  FC,
  FormEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ToastShow from '../../../component/Toasts/ToastShow';
import { addProduct, formReset } from '../../../redux/thunks/admin-thunks';
import { AppStateType } from '../../../redux/reducers/root-reducer';
import { Customer, ProductErrors } from '../../../types/types';
import { fetchProducts } from '../../../redux/thunks/product-thunks';
import { isValidNumber } from '../../../utils/functions';
import { addProductFailure } from '../../../redux/actions/admin-actions';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

type InitialStateType = {
  productName: string;
  productMinimumEA: number;
  productDescription: string;
  productPrice: number;
  file: string | Blob;
};

const AddProduct: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const customer: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const customerId: number = parseInt(sessionStorage.getItem('id') as string);

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
        title: `<strong>?????? ?????? ??????</strong>`,
        html: `<i>????????? ????????? ???????????????.</i>`,
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
        productError.productNameError = '???????????? ?????? ?????????.';
      }

      if (!Boolean(productDescription)) {
        productError.productDescriptionError = '?????? ????????? ?????? ?????????.';
      }

      if (!Boolean(productMinimumEA) || !isValidNumber(productMinimumEA)) {
        productError.productMinimumEAError = '?????? ?????? ????????? ?????? ?????????.';
      } else if (productMinimumEA < 1) {
        productError.productMinimumEAError =
          '?????? ?????? ????????? 0?????? ??? ???????????? ?????????.';
      }

      if (!Boolean(productPrice) || !isValidNumber(productPrice)) {
        productError.productPriceError = '?????? ????????? ?????? ?????????.';
      } else if (productPrice < 0) {
        productError.productPriceError = '?????? ????????? 0?????? ?????? ??? ????????????.';
      }

      if (!Boolean(file)) {
        productError.productImageFileError = '?????? ???????????? ?????? ?????????.';
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
          ?????? ????????????
        </h4>
        <br />
        <form onSubmit={onFormSubmit}>
          <div className="form row">
            <div className="col">
              <label>?????????: </label>
              <input
                type="text"
                className={
                  productNameError ? 'form-control is-invalid' : 'form-control'
                }
                name="productName"
                value={productName}
                placeholder="???????????? ???????????????"
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productNameError}</div>
            </div>
            <div className="col">
              <label>?????? ?????? ??????: </label>
              <input
                type="number"
                className={
                  productMinimumEAError
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                name="productMinimumEA"
                value={productMinimumEA}
                placeholder="?????? ?????? ????????? ???????????????."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productMinimumEAError}</div>
            </div>
          </div>
          <div className="form row mt-3">
            <div className="col">
              <label>??????: </label>
              <input
                type="text"
                className={
                  productDescriptionError
                    ? 'form-control is-invalid'
                    : 'form-control'
                }
                name="productDescription"
                value={productDescription}
                placeholder="?????? ????????? ???????????????."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productDescriptionError}</div>
            </div>
            <div className="col">
              <label>??????: </label>
              <input
                type="number"
                className={
                  productPriceError ? 'form-control is-invalid' : 'form-control'
                }
                name="productPrice"
                value={productPrice}
                placeholder="????????? ???????????????."
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

export default AddProduct;
