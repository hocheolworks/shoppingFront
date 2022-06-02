import React, { FC, useEffect } from "react";

import HomePageTheme from "../src/component/HomePageTheme/HomePageTheme";
import CarouselImageSlider from "../src/component/CarouselImageSlider/CarouselImageSlider";
import SliderBrands from "../src/component/SliderBrands/SliderBrands";
import SliderCards from "../src/component/ProductCardsSlider/ProductCardsSlider";
import { useDispatch } from "react-redux";
import { fetchCart } from "../src/redux/thunks/cart-thunks";
import ScrollButton from "../src/component/ScrollButton/ScrollButton";

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
    <div id="wrapper">
      <ScrollButton />
      <CarouselImageSlider />
      {/* <SliderBrands />
      <HomePageTheme />
      <SliderCards /> */}
    </div>
    </>
  );
};

export default HomePage;
