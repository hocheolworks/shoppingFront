import React, {
  FC,
  memo,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Estimate,
  EstimateItem,
  EstimateResponse,
  FCinLayout,
  Order,
  TaxBillInfo,
} from "../../../../src/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBan,
  faCheck,
  faCheckCircle,
  faClipboardList,
  faInfoCircle,
  faShoppingBag,
  faUndo,
} from "@fortawesome/free-solid-svg-icons";
import RequestService from "../../../../src/utils/request-service";
import { GetServerSideProps } from "next";
import AccountLayout from "../../../../src/component/AccountLayout/AccountLayout";
import { API_BASE_URL } from "../../../../src/utils/constants/url";
import { useCheckAdmin } from "../../../../src/hook/useCheckAdmin";
import Spinner from "../../../../src/component/Spinner/Spinner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);

const ManageUserOrder: FCinLayout = () => {
  // TODO : 세금계산서 쓸까봐 남겨둠, 안쓰면 지워야함
  const isAdmin = useCheckAdmin();
  const router = useRouter();
  const { sid } = router.query;
  const [estimate, setEstimate] = useState<Partial<Estimate>>({});
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([]);
  const defaultTotalProductsPrice = useRef<number>(0);
  const isMount = useRef<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    if (!isMount.current) {
      RequestService.get(`/order/estimate/${sid as string}`)
        .then((res) => setEstimate(res.data))
        .catch((err) => console.log(err));

      RequestService.get(`/order/estimate/items/${sid as string}`)
        .then((res) => {
          setEstimateItems(res.data);
          defaultTotalProductsPrice.current = res.data.reduce(
            (acc: number, cur: EstimateItem) =>
              (acc += cur.orderItemTotalPrice),
            0
          );
        })
        .catch((err) => console.log(err));

      isMount.current = true;
    }
  }, [refresh]);

  useEffect(() => {
    const tempTax = Math.floor(defaultTotalProductsPrice.current * 0.1);
    const tempPrintFee = 0;
    const tempDeliveryFee =
      defaultTotalProductsPrice.current >= 100_000 ? 0 : 5000;
    setTotalProductsPrice(defaultTotalProductsPrice.current);
    setTax(tempTax);
    setPrintFee(tempPrintFee);
    setDeliveryFee(tempDeliveryFee);
    setTotalPrice(
      defaultTotalProductsPrice.current +
        tempTax +
        tempPrintFee +
        tempDeliveryFee
    );
  }, [estimateItems]);

  const [isEstimateWrite, setIsEstimateWrite] = useState<boolean>(false);
  const [totalProductsPrice, setTotalProductsPrice] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [printFee, setPrintFee] = useState<number>(0);
  const [deliveryFee, setDeliveryFee] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [memo, setMemo] = useState<string>("");

  useEffect(() => {
    setTotalPrice(totalProductsPrice + tax + printFee + deliveryFee);
  }, [totalProductsPrice, tax, printFee, deliveryFee]);

  const {
    id,
    estimateName,
    estimateEmail,
    estimatePhoneNumber,
    estimateBusinessName,
    estimateBusinessType,
    estimateBusinessNumber,
    estimatePostIndex,
    estimateAddress,
    estimateAddressDetail,
    estimatePrintingDraft,
    estimateDesiredDate,
    estimateRequestMemo,
    customerId,
    requestStatus,
    createdAt,
    updatedAt,
    deletedAt,
  } = estimate;

  const onClickWrite = async () => {
    setIsEstimateWrite(true);
  };

  const onClickSend = async () => {
    if (!id) {
      return;
    }

    const estimateResponse: EstimateResponse = {
      estimateSheetId: id,
      totalProductsPrice: totalProductsPrice,
      tax: tax,
      printFee: printFee,
      deliveryFee: deliveryFee,
      totalPrice: totalPrice,
      memo: memo,
    };

    const result = await MySwal.fire({
      title: `<strong>견적서 발송</strong>`,
      html: `<i>견적서 발송 후에는 수정할 수 없습니다.<br/>발송하시겠습니까?</i>`,
      icon: "warning",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "발송",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      const response = await RequestService.post(
        "/order/admin/estimate/response",
        estimateResponse
      );

      if (response.data === true) {
        isMount.current = false;
        setRefresh(!refresh);
        setIsEstimateWrite(false);
      }
    } else {
    }
  };

  const onClickCancel = () => {
    setIsEstimateWrite(false);

    setTotalProductsPrice(defaultTotalProductsPrice.current);
    setTax(Math.floor(defaultTotalProductsPrice.current * 0.1));
    setPrintFee(0);
    setDeliveryFee(defaultTotalProductsPrice.current >= 100_000 ? 0 : 5000);
  };

  return isAdmin ? (
    <>
      <h4 style={{ textAlign: "center" }}>
        <FontAwesomeIcon icon={faShoppingBag} /> 견적 요청 #{id}
      </h4>
      <div className="row border my-5 px-5 py-3">
        <div className={"col-md-6"}>
          <h5 style={{ marginBottom: "30px" }}>
            <FontAwesomeIcon icon={faInfoCircle} /> 견적 요청 상세
          </h5>
          <p className="personal_data_item">
            이름:
            <span className="personal_data_text">{estimateName}</span>
          </p>
          <p className="personal_data_item">
            휴대폰 번호:
            <span className="personal_data_text">{estimatePhoneNumber}</span>
          </p>
          <p className="personal_data_item">
            우편번호:
            <span className="personal_data_text">{estimatePostIndex}</span>
          </p>
          <p className="personal_data_item">
            배송주소:
            <span className="personal_data_text">{estimateAddress}</span>
          </p>
          <p className="personal_data_item">
            상세주소:
            <span className="personal_data_text">{estimateAddressDetail}</span>
          </p>
          <p className="personal_data_item">
            요청사항
            <br />
            <textarea
              style={{
                marginTop: "5px",
                width: "100%",
                height: "200px",
                padding: "7px",
              }}
              id="requestMemo"
              value={estimateRequestMemo}
              readOnly
            />
          </p>
          {/* {designFiles.length > 0 && (
            <p className="personal_data_item">
              파일첨부:
              {designFiles.map((val, idx) => (
                <a
                  id="design_file_download"
                  className="personal_data_text"
                  href={val}
                >
                  다운로드#{idx + 1}
                </a>
              ))}
            </p>
          )} */}
        </div>
        <div className={"col-md-6"}>
          <h5 style={{ marginBottom: "30px" }}>
            <FontAwesomeIcon icon={faInfoCircle} /> 요청 정보
          </h5>
          <p className="personal_data_item">
            번호:
            <span className="personal_data_text">{id}</span>
          </p>
          <p className="personal_data_item">
            날짜:
            <span className="personal_data_text">
              {new Date(createdAt as string).toLocaleString("ko-kr")}
            </span>
          </p>
          <p className="personal_data_item">
            상태:
            <span className="personal_data_text">{requestStatus}</span>
          </p>
          {/* <p className="personal_data_item">
            결제여부:
            <span className="personal_data_text">
              {orderIsPaid ? "O" : "X"}
            </span>
          </p> */}
          <hr style={{ width: "70%" }} />
          <div
            style={{
              marginBottom: "30px",
              marginTop: "10px",
              paddingRight: "30%",
            }}
          >
            {requestStatus !== "답변완료" && !isEstimateWrite ? (
              <button className="btn btn-secondary" onClick={onClickWrite}>
                <FontAwesomeIcon icon={faClipboardList} /> 견적서 작성
              </button>
            ) : requestStatus === "답변완료" ? (
              <>
                <div className="d-flex justify-content-between">
                  <p className="personal_data_item">상품금액:</p>
                  <span className="personal_data_text">
                    {estimate.response?.totalProductsPrice.toLocaleString(
                      "ko-KR"
                    )}{" "}
                    원
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="personal_data_item">부가세:</p>
                  <span className="personal_data_text">
                    {estimate.response?.tax.toLocaleString("ko-KR")} 원
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="personal_data_item">인쇄비:</p>
                  <span className="personal_data_text">
                    {estimate.response?.printFee.toLocaleString("ko-KR")} 원
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="personal_data_item">배송비:</p>
                  <span className="personal_data_text">
                    {estimate.response?.deliveryFee.toLocaleString("ko-KR")} 원
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <h4>주문금액:</h4>
                  <h4 style={{ color: "green" }}>
                    {" "}
                    {estimate.response?.totalPrice.toLocaleString("ko-KR")} 원
                  </h4>
                </div>
                <hr style={{ width: "100%" }} />
                <div className="row mt-2">
                  <label className="col-sm-10 personal_data_item col-form-label">
                    안내사항
                  </label>
                  <div className="col-sm-12">
                    <textarea
                      name="memo"
                      style={{
                        width: "100%",
                        height: "100px",
                        padding: "7px",
                      }}
                      value={estimate.response?.memo}
                      readOnly
                    />
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
            {isEstimateWrite ? (
              <>
                <div className="row mb-1">
                  <label className="col-sm-5 col-form-label">상품 가격:</label>
                  <div className="col-sm-5">
                    <input
                      className="estimate_input text-right"
                      type="text"
                      name="totalProductsPrice"
                      value={totalProductsPrice.toLocaleString("ko-kr")}
                      onChange={(e) => {
                        setTotalProductsPrice(
                          e.target.value
                            ? parseInt(e.target.value.replaceAll(",", ""))
                            : 0
                        );
                        setTax(
                          e.target.value
                            ? Math.floor(
                                parseInt(e.target.value.replaceAll(",", "")) *
                                  0.1
                              )
                            : 0
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="row mb-1">
                  <label className="col-sm-5 col-form-label">부가세:</label>
                  <div className="col-sm-5">
                    <input
                      className="estimate_input text-right"
                      type="text"
                      name="tax"
                      defaultValue={tax.toLocaleString("ko-kr")}
                      readOnly
                    />
                  </div>
                </div>
                <div className="row mb-1">
                  <label className="col-sm-5 col-form-label">인쇄비:</label>
                  <div className="col-sm-5">
                    <input
                      className="estimate_input text-right"
                      type="text"
                      name="printFee"
                      value={printFee.toLocaleString("ko-kr")}
                      onChange={(e) => {
                        setPrintFee(
                          e.target.value
                            ? parseInt(e.target.value.replaceAll(",", ""))
                            : 0
                        );
                      }}
                    />
                  </div>
                </div>
                <div className="row mb-1">
                  <label className="col-sm-5 col-form-label">배송비:</label>
                  <div className="col-sm-5">
                    <input
                      className="estimate_input text-right"
                      type="text"
                      name="deliveryFee"
                      value={deliveryFee.toLocaleString("ko-kr")}
                      onChange={(e) => {
                        if (e.target.value) {
                          setDeliveryFee(
                            parseInt(e.target.value.replaceAll(",", ""))
                          );
                        } else {
                          setDeliveryFee(0);
                        }
                      }}
                    />
                  </div>
                </div>
                <hr style={{ width: "100%" }} />
                <div className="row mt-2">
                  <label className="col-sm-5 col-form-label">합계:</label>
                  <div className="col-sm-5">
                    <input
                      className="estimate_input text-right"
                      type="text"
                      name="totalPrice"
                      defaultValue={totalPrice.toLocaleString("ko-kr")}
                    />
                  </div>
                </div>
                <hr style={{ width: "100%" }} />
                <div className="row mt-2">
                  <label className="col-sm-10 col-form-label">안내사항</label>
                  <div className="col-sm-12">
                    <textarea
                      name="memo"
                      style={{
                        width: "100%",
                        height: "100px",
                        padding: "7px",
                      }}
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                    />
                  </div>
                </div>
                <div className="row d-flex justify-content-end mt-4">
                  <button
                    className="btn btn-success mr-3"
                    onClick={onClickSend}
                  >
                    <FontAwesomeIcon className="fa-solid" icon={faCheck} />{" "}
                    견적서 발송
                  </button>
                  <button
                    className="btn btn-secondary mr-4"
                    onClick={onClickCancel}
                  >
                    <FontAwesomeIcon className="fa-solid" icon={faBan} /> 취소
                  </button>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <table className="table border text-center">
        <thead className="table-active">
          <tr>
            <th>상품 번호</th>
            <th>상품 명</th>
            <th>수량</th>
            <th>가격</th>
            <th>합계</th>
            <th>인쇄여부</th>
          </tr>
        </thead>
        <tbody>
          {estimateItems.map((item) => {
            return (
              <tr key={item.id}>
                <th>
                  <Link href={`/product/${item.productId}`}>
                    <a>{item.productId}</a>
                  </Link>
                </th>
                <th>{item.productName}</th>
                <th>{item.estimateItemEA}</th>
                <th>{item.productPrice}원</th>
                <th>{item.orderItemTotalPrice}원</th>
                <th>{item.isPrint ? "O" : "X"}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  ) : (
    <Spinner />
  );
};

ManageUserOrder.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default ManageUserOrder;
