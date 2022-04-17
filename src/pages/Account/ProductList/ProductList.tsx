import React, { FC, useEffect } from "react";
import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Product } from "../../../types/types";
import { AppStateType } from "../../../redux/reducers/root-reducer";
import ProductListComponent from "./ProductListComponent";
import ScrollButton from "../../../component/ScrollButton/ScrollButton";
import { fetchProducts } from "../../../redux/thunks/product-thunks";

const ProductList: FC = () => {
  const dispatch = useDispatch();
  const products: Array<Product> = useSelector(
    (state: AppStateType) => state.product.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, []);

  const itemsPerPage = 24;
  const searchByData = [
    { label: "Brand", value: "productr" },
    { label: "Product title", value: "productTitle" },
    { label: "Manufacturer country", value: "country" },
    { label: "Gender", value: "productGender" },
  ];

  return (
    <div className="container">
      <ScrollButton />
      <Route
        exact
        component={() => (
          <ProductListComponent
            data={products}
            itemsPerPage={itemsPerPage}
            searchByData={searchByData}
          />
        )}
      />
    </div>
  );
};

export default ProductList;
