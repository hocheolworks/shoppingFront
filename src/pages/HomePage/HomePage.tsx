import React, { FC, useEffect } from 'react';

import HomePageTheme from '../../component/HomePageTheme/HomePageTheme';
import CarouselImageSlider from '../../component/CarouselImageSlider/CarouselImageSlider';
import SliderBrands from '../../component/SliderBrands/SliderBrands';
import SliderCards from '../../component/ProductCardsSlider/ProductCardsSlider';
import { useDispatch } from 'react-redux';
import { fetchCart } from '../../redux/thunks/cart-thunks';
import ScrollButton from '../../component/ScrollButton/ScrollButton';

const HomePage: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const productsFromLocalStorage: Map<number, number> = new Map(
      JSON.parse(localStorage.getItem('products') as string)
    );
    const customerId: string = localStorage.getItem('id') as string;
    dispatch(fetchCart(parseInt(customerId)));
  }, []);

  return (
    <div>
      <ScrollButton />
      <CarouselImageSlider />
      <SliderBrands />
      <HomePageTheme />
      <SliderCards />
    </div>
  );
};

export default HomePage;
