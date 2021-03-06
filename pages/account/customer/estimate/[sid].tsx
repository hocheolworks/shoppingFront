import React, { ReactElement, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Estimate,
  EstimateItem,
  FCinLayout,
} from "../../../../src/types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faInfoCircle,
  faShoppingBag,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import RequestService from "../../../../src/utils/request-service";
import AccountLayout from "../../../../src/component/AccountLayout/AccountLayout";
import { useCheckLogin } from "../../../../src/hook/useCheckLogin";
import { useDispatch } from "react-redux";
import {
  clearEstimatePaymentInfo,
  saveEstimatePaymentInfo,
} from "../../../../src/redux/actions/order-actions";

const ManageUserOrder: FCinLayout = () => {
  const isLogin = useCheckLogin();
  const dispatch = useDispatch();
  const router = useRouter();
  const [estimate, setEstimate] = useState<Partial<Estimate>>({});
  const [estimateItems, setEstimateItems] = useState<EstimateItem[]>([]);
  const isMount = useRef<boolean>(false);
  const { sid } = router.query;

  useEffect(() => {
    if (!isMount.current) {
      RequestService.get(`/order/estimate/${sid as string}`)
        .then((res) => setEstimate(res.data))
        .catch((err) => console.log(err));

      RequestService.get(`/order/estimate/items/${sid as string}`)
        .then((res) => {
          setEstimateItems(res.data);
        })
        .catch((err) => console.log(err));

      isMount.current = true;
      dispatch(clearEstimatePaymentInfo());
    }
  }, []);

  const [designFiles, setDesignFiles] = useState<string[]>([]);
  useEffect(() => {
    if (estimate && estimate.id) {
      RequestService.get(`/order/estimate/design/${estimate.id}`).then((res) =>
        setDesignFiles(res.data)
      );
    }
  }, [estimate]);
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

  const onClickPayment = () => {
    if (estimate && estimate.response) {
      dispatch(
        saveEstimatePaymentInfo({
          estimate: estimate,
          estimateResponse: estimate.response,
          estimateItems: estimateItems,
        })
      );

      router.push("/account/customer/estimate/payment");
    }
  };

  return isLogin ? (
    <>
      <h4 style={{ textAlign: "center" }}>
        <FontAwesomeIcon icon={faShoppingBag} /> ???????????? #{id}
      </h4>
      <div className="row border my-5 px-5 py-3">
        <div className="jc-center ml-3 w-100">
          <div
            style={{
              marginTop: "15px",
            }}
          ></div>
        </div>
        <div className={"col-md-6 jc-center"}>
          <h5 className="ml-0" style={{ marginBottom: "30px" }}>
            <FontAwesomeIcon icon={faInfoCircle} /> ???????????? ??????
          </h5>
          <p className="personal_data_item">
            ?????????:
            <span className="personal_data_text">{estimateName}</span>
          </p>
          <p className="personal_data_item">
            ?????????:
            <span className="personal_data_text">{estimateEmail}</span>
          </p>
          <p className="personal_data_item">
            ?????????:
            <span className="personal_data_text">{estimatePhoneNumber}</span>
          </p>
          <p className="personal_data_item">
            ????????????:
            <span className="personal_data_text">{estimatePostIndex}</span>
          </p>
          <p className="personal_data_item">
            ????????????:
            <span className="personal_data_text">{estimateAddress}</span>
          </p>
          <p className="personal_data_item">
            ????????????:
            <span className="personal_data_text">{estimateAddressDetail}</span>
          </p>
          <hr className="mb-3" />
          <p className="personal_data_item">
            ?????? ??????:
            <span className="personal_data_text">{estimateBusinessName}</span>
          </p>
          <p className="personal_data_item">
            ?????? ??? ??????:
            <span className="personal_data_text">{estimateBusinessType}</span>
          </p>
          <p className="personal_data_item">
            ????????? ????????????:
            <span className="personal_data_text">{estimateBusinessNumber}</span>
          </p>
          <hr className="mb-3" />
          <p className="personal_data_item">
            ?????? ?????????:
            <span className="personal_data_text">{estimateDesiredDate}</span>
          </p>
          {designFiles.length > 0 && (
            <p className="personal_data_item">
              ????????????
              <br />
              {designFiles.map((val, idx) => (
                <div key={`download#${idx}`}>
                  <a
                    id="design_file_download"
                    className="personal_data_text"
                    style={{ color: "blue" }}
                    href={val}
                  >
                    ????????????#{idx + 1}
                  </a>
                  <br />
                </div>
              ))}
            </p>
          )}
          <p className="personal_data_item">????????????</p>
          <textarea
            className="personal_data_text ml-0"
            id="requestMemo"
            value={estimateRequestMemo}
            style={{ width: "100%", height: "200px", padding: "7px" }}
            readOnly
          ></textarea>
        </div>
        <div className="col-md-6 d-flex flex-column justify-content-between">
          <div>
            <h5 className="ml-0" style={{ marginBottom: "30px" }}>
              <FontAwesomeIcon icon={faInfoCircle} /> ?????? ??????
            </h5>
            <p className="personal_data_item">
              ??????:
              <span className="personal_data_text">{id}</span>
            </p>
            <p className="personal_data_item">
              ??????:
              <span className="personal_data_text">
                {new Date(createdAt as string).toLocaleString("ko-kr")}
              </span>
            </p>
            <p className="personal_data_item">
              ??????:
              <span className="personal_data_text">{requestStatus}</span>
            </p>
          </div>
          <div>
            {(estimate.requestStatus === "????????????" ||
              estimate.requestStatus === "????????????" ||
              estimate.requestStatus === "????????????") &&
            estimate.response ? (
              <div className="border p-4">
                <h5
                  style={{
                    marginBottom: "30px",
                    marginLeft: "0px",
                    color: "purple",
                  }}
                >
                  <FontAwesomeIcon icon={faTable} /> ?????? ??????
                </h5>
                <div className="d-flex justify-content-between">
                  <p className="personal_data_item">????????????:</p>
                  <span className="personal_data_text">
                    {estimate.response.totalProductsPrice.toLocaleString(
                      "ko-KR"
                    )}{" "}
                    ???
                  </span>
                </div>
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">?????????:</p>
                  <span className="personal_data_text">
                    {estimate.response.tax.toLocaleString("ko-KR")} ???
                  </span>
                </div>
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">?????????:</p>
                  <span className="personal_data_text">
                    {estimate.response.printFee.toLocaleString("ko-KR")} ???
                  </span>
                </div>
                <div className="d-flex  justify-content-between">
                  <p className="personal_data_item">?????????:</p>
                  <span className="personal_data_text">
                    {estimate.response.deliveryFee.toLocaleString("ko-KR")} ???
                  </span>
                </div>
                <div className="d-flex justify-content-between">
                  <h4>????????????:</h4>
                  <h4 style={{ color: "green" }}>
                    {" "}
                    {estimate.response.totalPrice.toLocaleString("ko-KR")} ???
                  </h4>
                </div>
                <hr style={{ width: "100%" }} />
                <div className="row mt-2">
                  <label className="col-sm-10 personal_data_item col-form-label">
                    ????????? ????????????
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
                {estimate.requestStatus === "????????????" && (
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={onClickPayment}
                      className="btn btn-primary btn-lg btn-success mt-2"
                    >
                      <FontAwesomeIcon icon={faCheckCircle} /> ????????????
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <table className="table border text-center">
        <thead className="table-active">
          <tr>
            <th>?????? ??????</th>
            <th>?????? ???</th>
            <th>??????</th>
            <th>??????</th>
            <th>??????</th>
            <th>????????????</th>
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
                <th>{item.productPrice}???</th>
                <th>{item.orderItemTotalPrice}???</th>
                <th>{item.isPrint ? "O" : "X"}</th>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  ) : (
    <></>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

ManageUserOrder.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default ManageUserOrder;
