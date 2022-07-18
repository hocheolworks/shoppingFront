import React, { FC } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import Spinner from "../../../../src/component/Spinner/Spinner";
import { Estimate } from "../../../../src/types/types";

type PropsType = {
  estimates: Array<Estimate>;
  loading: boolean;
};

const EstimateTable: FC<PropsType> = ({ loading, estimates }) => {
  return (
    <div className="container">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <h4>
            <FontAwesomeIcon className="ml-2 mr-2" icon={faShoppingBag} /> 견적
            요청 목록
          </h4>
          <table className="table mt-4 border text-center">
            <thead className="table-active">
              <tr>
                <th>견적서 번호</th>
                <th>날짜</th>
                <th>대표자</th>
                <th>사업자등록번호</th>
                <th>상태</th>
                {/* <th>결제여부</th>
                <th>세금계산서</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {estimates.map((estimate: Estimate) => {
                return (
                  <tr key={estimate.id}>
                    <th>{estimate.id}</th>
                    <th>
                      {new Date(estimate.createdAt).toLocaleString("ko-kr")}
                    </th>
                    <th>{estimate.estimateName}</th>
                    <th>{estimate.estimateBusinessNumber}</th>
                    <th>{estimate.requestStatus}</th>
                    {/* <th>{estimate.orderIsPaid ? "O" : "X"}</th>
                    <th>{estimaterder.isTaxBill ? "O" : "X"}</th> */}
                    <th>
                      <Link href={`/account/admin/estimate/${estimate.id}`}>
                        <a>더보기</a>
                      </Link>
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default EstimateTable;
