import React, {
  ChangeEvent,
  FC,
  FormEvent,
  ReactElement,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ToastShow from "../../../src/component/Toasts/ToastShow";
import { addProduct, formReset } from "../../../src/redux/thunks/admin-thunks";
import { AppStateType } from "../../../src/redux/reducers/root-reducer";
import {
  Customer,
  FCinLayout,
  FileInQuill,
  ProductErrors,
} from "../../../src/types/types";
import { fetchProducts } from "../../../src/redux/thunks/product-thunks";
import { isValidNumber } from "../../../src/utils/functions";
import {
  addProductFailure,
  setProductContent,
} from "../../../src/redux/actions/admin-actions";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import AccountLayout from "../../../src/component/AccountLayout/AccountLayout";
import TextEditor from "../../../src/component/TextEditor/TextEditor";
import requestService from "../../../src/utils/request-service";
import { useCheckAdmin } from "../../../src/hook/useCheckAdmin";
import Spinner from "../../../src/component/Spinner/Spinner";

const MySwal = withReactContent(Swal);

type InitialStateType = {
  productName: string;
  productMinimumEA: number;
  productDescription: string;
  productPrice: number;
  file: string | Blob;
  productEA1: number;
  productEA2: number;
  productEA3: number;
  productEA4: number;
  productEA5: number;
  productPrice1: number | string;
  productPrice2: number | string;
  productPrice3: number | string;
  productPrice4: number | string;
  productPrice5: number | string;
};

const AddProduct: FCinLayout = () => {
  const dispatch = useDispatch();
  const isAdmin = useCheckAdmin();

  const addProductContent: string = useSelector(
    (state: AppStateType) => state.admin.addProductContent
  );
  const addProductImages: Array<FileInQuill> = useSelector(
    (state: AppStateType) => state.admin.addProductImages
  );

  const customerId = useRef<number>(-1);

  const toastTimeout = useRef<NodeJS.Timeout>();

  const isProductAdded: boolean = useSelector(
    (state: AppStateType) => state.admin.isProductAdded
  );
  const errors: Partial<ProductErrors> = useSelector(
    (state: AppStateType) => state.admin.errors
  );

  const initialState: InitialStateType = {
    productName: "",
    productMinimumEA: 0,
    productDescription: "",
    productPrice: 0,
    file: "",
    productEA1: 0,
    productEA2: 0,
    productEA3: 0,
    productEA4: 0,
    productEA5: 0,
    productPrice1: 0,
    productPrice2: 0,
    productPrice3: 0,
    productPrice4: 0,
    productPrice5: 0,
  };

  const [
    {
      productName,
      productMinimumEA,
      productEA1,
      productEA2,
      productEA3,
      productEA4,
      productEA5,
      productPrice1,
      productPrice2,
      productPrice3,
      productPrice4,
      productPrice5,
      productDescription,
      productPrice,
      file,
    },
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
    customerId.current = parseInt(sessionStorage.getItem("id") as string);

    if (Boolean(customerRoleError)) {
      MySwal.fire({
        title: `<strong>상품 추가 실패</strong>`,
        html: `<i>관리자 권한이 필요합니다.</i>`,
        icon: "error",
      });
    }

    return () => {
      window.clearTimeout(toastTimeout.current as NodeJS.Timeout);
      dispatch(formReset());
    };
  }, []);

  useEffect(() => {
    if (isProductAdded) {
      setState({ ...initialState });

      if (fileInput.current !== null) fileInput.current.value = "";

      setShowToast(true);
      toastTimeout.current = setTimeout(() => {
        setShowToast(false);
        dispatch(formReset());
      }, 5000);
      window.scrollTo(0, 0);
      dispatch(fetchProducts());
    }
  }, [isProductAdded]);

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !Boolean(productName) ||
      !Boolean(addProductContent) ||
      !Boolean(productMinimumEA) ||
      !isValidNumber(productMinimumEA) ||
      productMinimumEA < 1 ||
      !isValidNumber(productPrice) ||
      productPrice < 0 ||
      !Boolean(file)
    ) {
      const productError: ProductErrors = {
        productNameError: "",
        productDescriptionError: "",
        productMinimumEAError: "",
        productPriceError: "",
        productImageFileError: "",
        customerRoleError: "",
      };

      if (!Boolean(productName)) {
        productError.productNameError = "상품명은 필수 입니다.";
      }

      if (!Boolean(addProductContent)) {
        productError.productDescriptionError = "상품 설명은 필수 입니다.";
      }

      if (!Boolean(productMinimumEA) || !isValidNumber(productMinimumEA)) {
        productError.productMinimumEAError = "최소 주문 수량은 필수 입니다.";
      } else if (productMinimumEA < 1) {
        productError.productMinimumEAError =
          "최소 주문 수량은 0보다 큰 숫자여야 합니다.";
      }

      if (!isValidNumber(productPrice)) {
        productError.productPriceError = "상품 가격은 필수 입니다.";
      } else if (productPrice < 0) {
        productError.productPriceError = "상품 가격은 0보다 작을 수 없습니다.";
      }

      if (!Boolean(file)) {
        productError.productImageFileError = "상품 이미지는 필수 입니다.";
      }

      dispatch(addProductFailure(productError));
      return;
    }

    const bodyFormData: FormData = new FormData();
    bodyFormData.append("file", file as string);
    bodyFormData.append("productName", productName);
    bodyFormData.append("productMinimumEA", productMinimumEA.toString());
    bodyFormData.append("productEA1", productEA1.toString());
    bodyFormData.append("productEA2", productEA2.toString());
    bodyFormData.append("productEA3", productEA3.toString());
    bodyFormData.append("productEA4", productEA4.toString());
    bodyFormData.append("productEA5", productEA5.toString());
    bodyFormData.append("productPrice", productPrice.toString());
    bodyFormData.append("productPrice1", productPrice1.toString());
    bodyFormData.append("productPrice2", productPrice2.toString());
    bodyFormData.append("productPrice3", productPrice3.toString());
    bodyFormData.append("productPrice4", productPrice4.toString());
    bodyFormData.append("productPrice5", productPrice5.toString());

    if (customerId && customerId.current !== -1) {
      bodyFormData.append("customerId", customerId.current.toString());
    }

    if (addProductImages.length > 0) {
      const finalImages = addProductImages.filter((value) =>
        addProductContent.includes(value.base64)
      );

      const bodyFormDataFiles: FormData = new FormData();
      finalImages.forEach((val) => bodyFormDataFiles.append("files", val.file));

      const response = await requestService.post(
        "/product/detail/images",
        bodyFormDataFiles
      );

      const urls: Array<string> = response.data;

      if (urls.length !== finalImages.length) {
        console.log("서버에서 받아온 이미지 경로 개수가 일치하지 않습니다.");
        return;
      }

      let newAddProductContent = addProductContent;
      for (let i = 0; i < urls.length; i += 1) {
        newAddProductContent = newAddProductContent.replace(
          finalImages[i].base64,
          urls[i]
        );
      }
      bodyFormData.append("productDescription", newAddProductContent);
    } else {
      bodyFormData.append("productDescription", addProductContent);
    }

    dispatch(addProduct(bodyFormData));

    return;
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

  return isAdmin ? (
    <>
      <ToastShow
        showToast={showToast}
        message={"상품 추가가 완료되었습니다!"}
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
                  productNameError ? "form-control is-invalid" : "form-control"
                }
                name="productName"
                value={productName}
                placeholder="상품명을 입력하세요"
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productNameError}</div>
            </div>
          </div>
          <div className="form row mt-3">
            <div className="col">
              <label>주문 최소 수량: </label>
              <input
                type="number"
                className={
                  productMinimumEAError
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="productMinimumEA"
                value={productMinimumEA}
                placeholder="최소 주문 수량을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productMinimumEAError}</div>
            </div>
            <div className="col">
              <label>가격: </label>
              <input
                className={
                  productPriceError ? "form-control is-invalid" : "form-control"
                }
                name="productPrice"
                value={productPrice}
                placeholder="가격을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productPriceError}</div>
            </div>
          </div>

          <div className="form row mt-3">
            <div className="col">
              <label>주문 수량 범위1: </label>
              <input
                type="number"
                className={
                  productMinimumEAError
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="productEA1"
                value={productEA1}
                placeholder="주문 수량을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productMinimumEAError}</div>
            </div>
            <div className="col">
              <label>가격: </label>
              <input
                className={
                  productPriceError ? "form-control is-invalid" : "form-control"
                }
                name="productPrice1"
                value={productPrice1}
                placeholder="가격을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productPriceError}</div>
            </div>
          </div>
          <div className="form row mt-3">
            <div className="col">
              <label>주문 수량 범위2: </label>
              <input
                className={
                  productMinimumEAError
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="productEA2"
                value={productEA2}
                placeholder="주문 수량을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productMinimumEAError}</div>
            </div>
            <div className="col">
              <label>가격: </label>
              <input
                className={
                  productPriceError ? "form-control is-invalid" : "form-control"
                }
                name="productPrice2"
                value={productPrice2}
                placeholder="가격을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productPriceError}</div>
            </div>
          </div>
          <div className="form row mt-3">
            <div className="col">
              <label>주문 수량 범위3: </label>
              <input
                type="number"
                className={
                  productMinimumEAError
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="productEA3"
                value={productEA3}
                placeholder="주문 수량을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productMinimumEAError}</div>
            </div>
            <div className="col">
              <label>가격: </label>
              <input
                className={
                  productPriceError ? "form-control is-invalid" : "form-control"
                }
                name="productPrice3"
                value={productPrice3}
                placeholder="가격을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productPriceError}</div>
            </div>
          </div>
          <div className="form row mt-3">
            <div className="col">
              <label>주문 수량 범위4: </label>
              <input
                type="number"
                className={
                  productMinimumEAError
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="productEA4"
                value={productEA4}
                placeholder="주문 수량을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productMinimumEAError}</div>
            </div>
            <div className="col">
              <label>가격: </label>
              <input
                className={
                  productPriceError ? "form-control is-invalid" : "form-control"
                }
                name="productPrice4"
                value={productPrice4}
                placeholder="가격을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productPriceError}</div>
            </div>
          </div>
          <div className="form row mt-3">
            <div className="col">
              <label>주문 수량 범위5: </label>
              <input
                type="number"
                className={
                  productMinimumEAError
                    ? "form-control is-invalid"
                    : "form-control"
                }
                name="productEA5"
                value={productEA5}
                placeholder="주문 수량을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productMinimumEAError}</div>
            </div>
            <div className="col">
              <label>가격: </label>
              <input
                className={
                  productPriceError ? "form-control is-invalid" : "form-control"
                }
                name="productPrice5"
                value={productPrice5}
                placeholder="가격을 입력하세요."
                onChange={handleInputChange}
              />
              <div className="invalid-feedback">{productPriceError}</div>
            </div>
          </div>

          <div className="form row mt-3">
            <div className="col">
              <label>설명: </label>
              <TextEditor />
              {/* <input
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
              /> */}
              <div className="invalid-feedback">{productDescriptionError}</div>
            </div>
          </div>
          <div className="form row mt-3">
            <div className="col" style={{ marginTop: "35px" }}>
              <input
                type="file"
                className={
                  productImageFileError
                    ? "form-control is-invalid"
                    : "form-control"
                }
                style={{ height: "44px" }}
                name="file"
                ref={fileInput}
                onChange={handleFileChange}
              />
              <div className="invalid-feedback">{productImageFileError}</div>
            </div>
          </div>
          <button type="submit" className="btn btn-dark mt-3 mb-5">
            <FontAwesomeIcon className="mr-2" icon={faPlusSquare} />
            추가
          </button>
        </form>
      </div>
    </>
  ) : (
    <Spinner />
  );
};

AddProduct.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default AddProduct;
