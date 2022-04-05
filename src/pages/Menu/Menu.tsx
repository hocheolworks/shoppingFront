import React, { FC, useEffect, useState } from 'react';
import { Route, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import Checkbox from '../../component/CheckBox/Checkbox';
import CheckboxRadio from '../../component/CheckboxRadio/CheckboxRadio';
import MenuCards from '../../component/MenuCards/MenuCards';
import { gender, perfumer, price } from './MenuData';
import { fetchProducts } from '../../redux/thunks/product-thunks';
import './MenuStyle.css';
import { AppStateType } from '../../redux/reducers/root-reducer';
import { Product } from '../../types/types';
import ScrollButton from '../../component/ScrollButton/ScrollButton';

const Menu: FC = () => {
    const dispatch = useDispatch();
    const products: Array<Product> = useSelector(
        (state: AppStateType) => state.product.products
    );
    const loading: boolean = useSelector(
        (state: AppStateType) => state.product.isProductLoading
    );
    const [sortByPrice, setSortByPrice] = useState<boolean>();
    const { state } = useLocation<{ id: string }>();

    useEffect(() => {
        const ProductData: string = state.id;
        if (ProductData === 'all') {
            dispatch(fetchProducts());
            window.scrollTo(0, 0);
        }
    }, []);

    return (
        <div className="container d-flex">
            <ScrollButton />
            <Route
                exact
                component={() => (
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
                )}
            />
        </div>
    );
};

export default Menu;
