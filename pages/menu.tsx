import React, { FC, useEffect, useState } from 'react';
// import { Route, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { NextRouter, useRouter } from 'next/router';

import MenuCards from '../src/component/MenuCards/MenuCards';

import { AppStateType } from '../src/redux/reducers/root-reducer';
import { Product } from '../src/types/types';
import ScrollButton from '../src/component/ScrollButton/ScrollButton';
import RequestService from '../src/utils/request-service';
import { GetServerSideProps } from 'next';

type MenuProps = {
  products: Array<Product>;
};

const Menu: FC<MenuProps> = ({ products }) => {
  const loading: boolean = useSelector(
    (state: AppStateType) => state.product.isProductLoading
  );
  const [sortByPrice, setSortByPrice] = useState<boolean>();
  const router: NextRouter = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // dispatch(fetchProducts());
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="container d-flex" id='mid'>
      <ScrollButton />

      <MenuCards
        data={products}
        loading={loading}
        itemsPerPage={16}
        searchByData={[
          { label: 'Brand', value: 'perfumer' },
          { label: 'Perfume title', value: 'perfumeTitle' },
          { label: 'Manufacturer country', value: 'country' },
        ]}
        sortByPrice={sortByPrice}
      />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await RequestService.get('/product/all');
  const products = response.data;
  return { props: { products } };
};

export default Menu;
