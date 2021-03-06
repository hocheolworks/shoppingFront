import React, {
  ChangeEvent,
  FC,
  FormEvent,
  ReactElement,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import {
  fetchProduct,
  fetchProducts,
} from "../../../../src/redux/thunks/product-thunks";
import {
  formReset,
  updateProduct,
} from "../../../../src/redux/thunks/admin-thunks";
import { AppStateType } from "../../../../src/redux/reducers/root-reducer";
import {
  FCinLayout,
  FileInQuill,
  Product,
  ProductErrors,
} from "../../../../src/types/types";
import ToastShow from "../../../../src/component/Toasts/ToastShow";
import { makeImageUrl } from "../../../../src/utils/functions";
import Spinner from "../../../../src/component/Spinner/Spinner";
import AccountLayout from "../../../../src/component/AccountLayout/AccountLayout";
import TextEditor from "../../../../src/component/TextEditor/TextEditor";
import {
  clearAddProductEditor,
  pushProductImage,
  setProductContent,
} from "../../../../src/redux/actions/admin-actions";
import requestService from "../../../../src/utils/request-service";
import { useCheckAdmin } from "../../../../src/hook/useCheckAdmin";

const EditProduct: FCinLayout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const isAdmin = useCheckAdmin();
  const { pid } = router.query;
  const customerId = useRef<number>(-1);
  const productData: Partial<Product> = useSelector(
    (state: AppStateType) => state.product.product
  );
  const errors: Partial<ProductErrors> = {};
  const isProductEdited: boolean = useSelector(
    (state: AppStateType) => state.admin.isProductEdited
  );

  const productContent: string = useSelector(
    (state: AppStateType) => state.admin.addProductContent
  );

  const productImages: Array<FileInQuill> = useSelector(
    (state: AppStateType) => state.admin.addProductImages
  );

  const prevProductImages = useRef<string[]>([]);

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
  } = errors;

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

  // const initialState: InitialStateType = {
  //   productName: "",
  //   productMinimumEA: 0,
  //   productDescription: "",
  //   productPrice: 0,
  //   file: "",
  //   productEA1: 0,
  //   productEA2: 0,
  //   productEA3: 0,
  //   productEA4: 0,
  //   productEA5: 0,
  //   productPrice1: 0,
  //   productPrice2: 0,
  //   productPrice3: 0,
  //   productPrice4: 0,
  //   productPrice5: 0,
  // };

  // const [
  //   {
  //     productEA1,
  //     productEA2,
  //     productEA3,
  //     productEA4,
  //     productEA5,
  //     productPrice1,
  //     productPrice2,
  //     productPrice3,
  //     productPrice4,
  //     productPrice5,
  //   },
  //   setState,
  // ] = useState(initialState);
  const {
    productName,
    productDescription,
    productMinimumEA,
    productPrice,
    productImageFilepath,
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
  } = product;

  const fileInput: RefObject<HTMLInputElement> = useRef<HTMLInputElement>(null);

  useEffect(() => {
    customerId.current = parseInt(sessionStorage.getItem("id") as string);
    dispatch(clearAddProductEditor());
    dispatch(fetchProduct(parseInt(pid as string)));
  }, []);

  useEffect(() => {
    setLoading(productData.id !== parseInt(pid as string));
    console.log(productData);
  }, [productData]);

  useEffect(() => {
    if (productData.productDescription) {
      prevProductImages.current = [];
      dispatch(setProductContent(productData.productDescription));
      const regex: RegExp = /src=[\"']?([^>\"']*)[\"']?[^>]*/g;
      productData.productDescription.match(regex)?.map((val) => {
        const imgUrl = val.slice(5).slice(0, -1);
        if (!prevProductImages.current.includes(imgUrl))
          prevProductImages.current.push(imgUrl);
        dispatch(pushProductImage({ base64: imgUrl, file: "-1" }));
      });
    }
    setProduct(productData);
    if (isProductEdited) {
      if (fileInput.current !== null) fileInput.current.value = "";
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        dispatch(formReset());
      }, 5000);
      window.scrollTo(0, 0);
      dispatch(fetchProducts());
    }
  }, [productData]);

  const onFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const bodyFormData: FormData = new FormData();

    bodyFormData.append("productEA1", productEA1.toString());
    bodyFormData.append("productEA2", productEA2.toString());
    bodyFormData.append("productEA3", productEA3.toString());
    bodyFormData.append("productEA4", productEA4.toString());
    bodyFormData.append("productEA5", productEA5.toString());
    bodyFormData.append("productPrice1", productPrice1.toString());
    bodyFormData.append("productPrice2", productPrice2.toString());
    bodyFormData.append("productPrice3", productPrice3.toString());
    bodyFormData.append("productPrice4", productPrice4.toString());
    bodyFormData.append("productPrice5", productPrice5.toString());

    if (file) {
      bodyFormData.append("file", file as string);
    }
    if (productName) {
      bodyFormData.append("productName", productName);
    }
    if (productMinimumEA) {
      bodyFormData.append("productMinimumEA", productMinimumEA.toString());
    }
    if (productDescription) {
      bodyFormData.append("productDescription", productContent);
    }
    if (productPrice) {
      bodyFormData.append("productPrice", productPrice.toString());
    }
    console.log(productContent);
    console.log(productDescription);
    console.log(bodyFormData);

    // 추가된 이미지는 서버에 저장 요청, url 받아서 img 태그의 src에 삽입
    if (productImages.length > 0) {
      const insertImages = productImages.filter(
        (value) => productContent.includes(value.base64) && value.file != "-1"
      );

      if (insertImages.length > 0) {
        const bodyFormDataFiles: FormData = new FormData();
        insertImages.forEach((val) =>
          bodyFormDataFiles.append("files", val.file)
        );

        const response = await requestService.post(
          "/product/detail/images",
          bodyFormDataFiles
        );
        const urls: Array<string> = response.data;

        if (urls.length !== insertImages.length) {
          console.log("서버에서 받아온 이미지 경로 개수가 일치하지 않습니다.");
          return;
        }

        let newProductContent = productContent;
        for (let i = 0; i < urls.length; i += 1) {
          newProductContent = newProductContent.replace(
            insertImages[i].base64,
            urls[i]
          );
        }

        bodyFormData.set("productDescription", newProductContent);
      }
    }
    // 삭제된 이미지는 서버에 삭제 요청
    if (prevProductImages.current.length > 0) {
      const deleteImages = prevProductImages.current.filter(
        (value) => !productContent.includes(value)
      );
      if (deleteImages.length > 0) {
        const response = await requestService.post(
          "/product/detail/images2delete",
          deleteImages
        );
        console.log(response);
      }
    }
    // return;
    dispatch(
      updateProduct(parseInt(pid as string), customerId.current, bodyFormData)
    );
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

  return isAdmin ? (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <ToastShow
            showToast={showToast}
            message={"상품 수정이 완료되었습니다!"}
          />
          <div className="container">
            <h4>
              <FontAwesomeIcon className="mr-2" icon={faEdit} />
              상품 수정
            </h4>
            <form onSubmit={onFormSubmit}>
              <div className="form row">
                <div className="col">
                  <label>상품명: </label>
                  <input
                    type="text"
                    className={
                      productNameError
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    name="productName"
                    value={productName}
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
                  <div className="invalid-feedback">
                    {productMinimumEAError}
                  </div>
                </div>
                <div className="col">
                  <label>가격: </label>
                  <input
                    type="number"
                    className={
                      productPriceError
                        ? "form-control is-invalid"
                        : "form-control"
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
                  <div className="invalid-feedback">
                    {productMinimumEAError}
                  </div>
                </div>
                <div className="col">
                  <label>가격: </label>
                  <input
                    className={
                      productPriceError
                        ? "form-control is-invalid"
                        : "form-control"
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
                  <div className="invalid-feedback">
                    {productMinimumEAError}
                  </div>
                </div>
                <div className="col">
                  <label>가격: </label>
                  <input
                    className={
                      productPriceError
                        ? "form-control is-invalid"
                        : "form-control"
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
                  <div className="invalid-feedback">
                    {productMinimumEAError}
                  </div>
                </div>
                <div className="col">
                  <label>가격: </label>
                  <input
                    className={
                      productPriceError
                        ? "form-control is-invalid"
                        : "form-control"
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
                  <div className="invalid-feedback">
                    {productMinimumEAError}
                  </div>
                </div>
                <div className="col">
                  <label>가격: </label>
                  <input
                    className={
                      productPriceError
                        ? "form-control is-invalid"
                        : "form-control"
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
                  <div className="invalid-feedback">
                    {productMinimumEAError}
                  </div>
                </div>
                <div className="col">
                  <label>가격: </label>
                  <input
                    className={
                      productPriceError
                        ? "form-control is-invalid"
                        : "form-control"
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
                  <TextEditor contentsProp={productDescription} />
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
                  <div className="invalid-feedback">
                    {productDescriptionError}
                  </div>
                </div>
              </div>
              <div className="form row mt-3">
                <div className="col">
                  <label>상품이미지: </label>
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
                    placeholder=""
                  />
                  <img
                    src={
                      file
                        ? imgSrc
                        : makeImageUrl(productImageFilepath as string)
                    }
                    className="rounded mx-auto w-30 mb-2"
                    style={{ width: "180px" }}
                  />
                  <div className="invalid-feedback">
                    {productImageFileError}
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-dark mt-3 mb-5">
                <FontAwesomeIcon className="mr-2" icon={faEdit} />
                수정
              </button>
            </form>
          </div>
        </>
      )}
    </>
  ) : (
    <Spinner />
  );
};

EditProduct.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default EditProduct;
