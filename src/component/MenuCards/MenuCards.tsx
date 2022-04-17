import React, { FC } from "react";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import usePagination from "../Pagination/usePagination";
import PerfumeCardItem from "../PerfumeCardItem/PerfumeCardItem";
import PaginationItem from "../Pagination/PaginationItem";
import SearchForm from "../SearchForm/SearchForm";
import { Product } from "../../types/types";
import Spinner from "../Spinner/Spinner";

type PropsType = {
  data: Array<Product>;
  loading: boolean;
  itemsPerPage: number;
  startFrom?: number;
  searchByData: Array<{ label: string; value: string }>;
  sortByPrice: boolean | undefined;
};

const MenuCards: FC<PropsType> = ({
  data,
  loading,
  itemsPerPage,
  startFrom,
  searchByData,
  sortByPrice,
}) => {
  const {
    slicedData,
    pagination,
    prevPage,
    nextPage,
    changePage,
    setFilteredData,
    setSearching,
  } = usePagination({ itemsPerPage, data, startFrom });

  return (
    <div className="container">
      <div className="container-fluid mt-5 ml-2">
        {/* <SearchForm
                    data={data}
                    searchByData={searchByData}
                    setFilteredData={setFilteredData}
                    setSearching={setSearching}
                /> */}
      </div>
      <div className="container-fluid mt-3 ml-2">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="row">
              {slicedData.map((product: Product) => {
                return (
                  <PerfumeCardItem
                    divKey={product.id}
                    product={product}
                    colSize={3}
                    link={"/product"}
                    btnName={"상세 보기"}
                  />
                );
              })}
            </div>
            <PaginationItem
              pagination={pagination}
              prevPage={prevPage}
              changePage={changePage}
              nextPage={nextPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default MenuCards;
