import React, { FC, ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FCinLayout, Product } from '../../../../src/types/types';
import { AppStateType } from '../../../../src/redux/reducers/root-reducer';
import ProductListComponent from '../../../../src/pages/Account/ProductList/ProductListComponent';
import ScrollButton from '../../../../src/component/ScrollButton/ScrollButton';
import { fetchProducts } from '../../../../src/redux/thunks/product-thunks';
import AccountLayout from '../../../../src/component/AccountLayout/AccountLayout';

const ProductList: FCinLayout = () => {
  const dispatch = useDispatch();
  const products: Array<Product> = useSelector(
    (state: AppStateType) => state.product.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const itemsPerPage = 24;
  const searchByData = [
    { label: 'Brand', value: 'productr' },
    { label: 'Product title', value: 'productTitle' },
    { label: 'Manufacturer country', value: 'country' },
    { label: 'Gender', value: 'productGender' },
  ];

  return (
    <div className="container">
      <ScrollButton />
      <ProductListComponent
        data={products}
        itemsPerPage={itemsPerPage}
        searchByData={searchByData}
      />
    </div>
  );
};

ProductList.getLayout = function getLayout(page: ReactElement) {
  return <AccountLayout>{page}</AccountLayout>;
};

export default ProductList;
