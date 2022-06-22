import React, { FC, useEffect, useState } from "react";
// import { Route, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";
import { NextRouter, useRouter } from "next/router";

import MenuCards from "../src/component/MenuCards/MenuCards";

import { AppStateType } from "../src/redux/reducers/root-reducer";
import { Product } from "../src/types/types";
import ScrollButton from "../src/component/ScrollButton/ScrollButton";
import RequestService from "../src/utils/request-service";
import { GetServerSideProps } from "next";
import Head from "next/head";

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
    <>
      <Head>
        <title>진솔유통 - 상품 목록</title>
        <meta
          name="description"
          content="타포린 마트 가방 전문, 인쇄 가능 마트 사은품, 소량 및 대량 주문제작, 대량 구매시 전국 최저가 보장"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={"진솔유통 - 마트 가방 전문"} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://jinsoltrade.com/menu`} />
        <meta
          property="og:image"
          content="https://iljo-product.s3.ap-northeast-2.amazonaws.com/blue_bag_front_flat_1655543067027.png"
        />
        <meta property="og:article:author" content="진솔유통" />
      </Head>

      <div className="container d-flex" id="mid" title="menu">
        <ScrollButton />

        <MenuCards
          data={products}
          loading={loading}
          itemsPerPage={16}
          searchByData={[
            { label: "Brand", value: "perfumer" },
            { label: "Perfume title", value: "perfumeTitle" },
            { label: "Manufacturer country", value: "country" },
          ]}
          sortByPrice={sortByPrice}
        />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await RequestService.get("/product/all");
  const products = response.data;
  return { props: { products } };
};

export default Menu;
