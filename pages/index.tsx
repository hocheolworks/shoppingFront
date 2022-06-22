import React, { FC, useEffect } from "react";

import HomePageTheme from "../src/component/HomePageTheme/HomePageTheme";
import CarouselImageSlider from "../src/component/CarouselImageSlider/CarouselImageSlider";
import SliderBrands from "../src/component/SliderBrands/SliderBrands";
import SliderCards from "../src/component/ProductCardsSlider/ProductCardsSlider";
import { useDispatch } from "react-redux";
import { fetchCart } from "../src/redux/thunks/cart-thunks";
import ScrollButton from "../src/component/ScrollButton/ScrollButton";
import Head from "next/head";

const HomePage: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const customerId: string = window.sessionStorage.getItem("id") as string;
    const isLoggedIn: string = window.sessionStorage.getItem(
      "isLoggedIn"
    ) as string;
    if (isLoggedIn === "true") dispatch(fetchCart(parseInt(customerId)));
  }, []);

  return (
    <>
      <Head>
        <title>진솔유통 - 타포린 마트 가방 전문 | 주문 제작</title>
        <meta
          name="keyword"
          content="타포린, 마트 가방, 사은품, 인쇄 가능, 타포린 가방"
        ></meta>
        <meta
          name="description"
          content={`타포린 마트 가방 전문, 인쇄 가능 마트 사은품, 소량 및 대량 주문제작, 대량 구매시 전국 최저가 보장`}
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta property="og:title" content={"진솔유통 - 마트 가방 전문"} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://jinsoltrade.com/`} />
        <meta property="og:description" content={`메인 페이지`}></meta>
        <meta
          property="og:image"
          content="https://iljo-product.s3.ap-northeast-2.amazonaws.com/A_inside.jpg"
        />
        <meta property="og:article:author" content="진솔유통" />
      </Head>

      <div id="mid" className="home">
        <div>
          <ScrollButton />
          <CarouselImageSlider />
          {/* <SliderBrands />
      <HomePageTheme />
      <SliderCards /> */}
        </div>
      </div>
    </>
  );
};

export default HomePage;
