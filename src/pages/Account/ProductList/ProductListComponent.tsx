import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faList, faTrash } from '@fortawesome/free-solid-svg-icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import usePagination from '../../../component/Pagination/usePagination';
import { Customer, Product } from '../../../types/types';
import Modal from '../../../component/Modal/Modal';
import SearchForm from '../../../component/SearchForm/SearchForm';
import PaginationItem from '../../../component/Pagination/PaginationItem';
import StarRating from '../../../component/StarRating/StarRating';
import { deleteProduct } from '../../../redux/thunks/admin-thunks';
import { AppStateType } from '../../../redux/reducers/root-reducer';
import Spinner from '../../../component/Spinner/Spinner';
import { API_BASE_URL } from '../../../utils/constants/url';

type PropsType = {
  data: Array<Product>;
  itemsPerPage: number;
  startFrom?: number;
  searchByData: Array<{ label: string; value: string }>;
};

const ProductListComponent: FC<PropsType> = ({
  data,
  itemsPerPage,
  startFrom,
  searchByData,
}) => {
  const dispatch = useDispatch();
  const loading: boolean = useSelector(
    (state: AppStateType) => state.product.isProductLoading
  );

  const customer: Partial<Customer> = useSelector(
    (state: AppStateType) => state.customer.customer
  );

  const [modalActive, setModalActive] = useState<boolean>(false);
  const [productInfo, setProductInfo] = useState<Product>();

  const {
    slicedData,
    pagination,
    prevPage,
    nextPage,
    changePage,
    setFilteredData,
    setSearching,
  } = usePagination({ itemsPerPage, data, startFrom });

  useEffect(() => {
    setModalActive(false);
  }, [data]);

  const deleteProductHandler = (id: number): void => {
    dispatch(deleteProduct(id, customer.id as number));
  };

  const showDeleteModalWindow = (product: Product): void => {
    setModalActive(true);
    setProductInfo(product);
  };

  return (
    <>
      {modalActive
        ? productInfo && (
            <Modal
              product={productInfo}
              deleteProductHandler={deleteProductHandler}
              setModalActive={setModalActive}
            />
          )
        : null}
      <h4>
        <FontAwesomeIcon className="ml-2 mr-2" icon={faList} /> 상품 목록
      </h4>
      <br />
      {/* <div className="mt-3">
        <PaginationItem
          pagination={pagination}
          prevPage={prevPage}
          changePage={changePage}
          nextPage={nextPage}
        />
      </div> */}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="container-fluid mt-3">
            <div className="row">
              {slicedData.map((product: Product) => {
                return (
                  <div key={product.id} className="col-lg-3">
                    <div className="card mb-5" style={{ height: '320px' }}>
                      <div
                        style={{
                          height: '92px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <LazyLoadImage
                          effect="blur"
                          style={{
                            width: '90px',
                            marginTop: '20px',
                          }}
                          src={`${API_BASE_URL.replace('api/v1', '')}${
                            product.productImageFilepath
                          }`}
                        />
                      </div>
                      <div className="card-body text-center mt-2">
                        <StarRating productRating={product.productRating} />
                        <h6>상품 번호 : {product.id}</h6>
                        <h6>{product.productName}</h6>
                        <h6>
                          <span>
                            {product.productPrice.toLocaleString('ko-kr')} 원
                          </span>
                        </h6>
                      </div>
                      <div className="btn-group text-center mb-3">
                        <Link
                          type="button"
                          className="btn btn-dark ml-2"
                          to={`/account/admin/products/${product.id}`}
                        >
                          <FontAwesomeIcon className="fa-xs" icon={faEdit} />{' '}
                          수정
                        </Link>
                        <button
                          className="btn btn-warning mr-2"
                          onClick={() => showDeleteModalWindow(product)}
                        >
                          <FontAwesomeIcon className="fa-xs" icon={faTrash} />{' '}
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <PaginationItem
            pagination={pagination}
            prevPage={prevPage}
            changePage={changePage}
            nextPage={nextPage}
          />
        </>
      )}
    </>
  );
};

export default ProductListComponent;
