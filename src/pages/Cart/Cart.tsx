import React, { ChangeEvent, FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    faChevronDown,
    faChevronUp,
    faMinusSquare,
    faShoppingBag,
    faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Spinner from '../../component/Spinner/Spinner';
import {
    calculateCartPrice,
    fetchCart,
    loadCart,
} from '../../redux/thunks/cart-thunks';
import { AppStateType } from '../../redux/reducers/root-reducer';
import { Product } from '../../types/types';

const Cart: FC = () => {
    const dispatch = useDispatch();
    const products: Array<Product> = useSelector(
        (state: AppStateType) => state.cart.products
    );
    const totalPrice: number = useSelector(
        (state: AppStateType) => state.cart.totalPrice
    );
    const loading: boolean = useSelector(
        (state: AppStateType) => state.cart.loading
    );
    const [productInCart, setProductInCart] = useState(() => new Map());

    useEffect(() => {
        const productsFromLocalStorage: Map<number, number> = new Map(
            JSON.parse(localStorage.getItem('products') as string)
        );

        if (productsFromLocalStorage !== null) {
            dispatch(fetchCart(Array.from(productsFromLocalStorage.keys())));
            productsFromLocalStorage.forEach((value: number, key: number) => {
                setProductInCart(productInCart.set(key, value));
            });
        } else {
            dispatch(loadCart());
        }
    }, []);

    const deleteFromCart = (productId: number): void => {
        productInCart.delete(productId);

        if (productInCart.size === 0) {
            localStorage.removeItem('products');
            setProductInCart(new Map());
        } else {
            localStorage.setItem(
                'products',
                JSON.stringify(Array.from(productInCart.entries()))
            );
        }
        dispatch(fetchCart(Array.from(productInCart.keys())));
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>,
        productId: number
    ): void => {
        if (
            isNaN(parseInt(event.target.value)) ||
            parseInt(event.target.value) === 0 ||
            parseInt(event.target.value) > 99
        ) {
            setProductInCart(productInCart.set(productId, 1));
            localStorage.setItem(
                'products',
                JSON.stringify(Array.from(productInCart.entries()))
            );
        } else {
            setProductInCart(
                productInCart.set(productId, parseInt(event.target.value))
            );
            localStorage.setItem(
                'products',
                JSON.stringify(Array.from(productInCart.entries()))
            );
        }
        dispatch(calculateCartPrice(products));
    };

    const onIncrease = (productId: number): void => {
        setProductInCart(
            productInCart.set(productId, productInCart.get(productId) + 1)
        );
        localStorage.setItem(
            'products',
            JSON.stringify(Array.from(productInCart.entries()))
        );
        dispatch(calculateCartPrice(products));
    };

    const onDecrease = (productId: number): void => {
        setProductInCart(
            productInCart.set(productId, productInCart.get(productId) - 1)
        );
        localStorage.setItem(
            'products',
            JSON.stringify(Array.from(productInCart.entries()))
        );
        dispatch(calculateCartPrice(products));
    };

    return (
        <div className="container mt-5 pb-5" style={{ minHeight: '350px' }}>
            {loading ? (
                <Spinner />
            ) : (
                <div>
                    {products.length === 0 ? (
                        <div style={{ textAlign: 'center' }}>
                            <h2>Cart is empty</h2>
                        </div>
                    ) : (
                        <div>
                            <p className="h4 mb-4 text-center">
                                <FontAwesomeIcon
                                    className="mr-2"
                                    icon={faShoppingCart}
                                />{' '}
                                장바구니
                            </p>
                            {products.map((product: Product) => {
                                return (
                                    <div
                                        key={product.id}
                                        className="card mb-3 mx-auto"
                                        style={{ maxWidth: '940px' }}
                                    >
                                        <div className="row no-gutters">
                                            <div className="col-2 mx-3 my-3">
                                                <img
                                                    src={`/image/product/${product.productName}.jpeg`}
                                                    className="img-fluid"
                                                />
                                            </div>
                                            <div className="col-6">
                                                <div className="card-body">
                                                    <h4 className="card-title">
                                                        {product.productName}
                                                    </h4>
                                                    <p className="card-text"></p>
                                                    <p className="card-text"></p>
                                                </div>
                                            </div>
                                            <div className="col-1 mt-3">
                                                <button
                                                    className="btn btn-default"
                                                    disabled={
                                                        productInCart.get(
                                                            product.id
                                                        ) === 99
                                                    }
                                                    onClick={() =>
                                                        onIncrease(product.id)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        size="lg"
                                                        icon={faChevronUp}
                                                    />
                                                </button>
                                                <input
                                                    type="text"
                                                    className="form-control input-number"
                                                    style={{ width: '45px' }}
                                                    value={productInCart.get(
                                                        product.id
                                                    )}
                                                    onChange={(event) =>
                                                        handleInputChange(
                                                            event,
                                                            product.id
                                                        )
                                                    }
                                                />
                                                <button
                                                    className="btn btn-default"
                                                    disabled={
                                                        productInCart.get(
                                                            product.id
                                                        ) === 1
                                                    }
                                                    onClick={() =>
                                                        onDecrease(product.id)
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        size="lg"
                                                        icon={faChevronDown}
                                                    />
                                                </button>
                                            </div>
                                            <div className="col-2">
                                                <div className="card-body">
                                                    <h5 className="card-title">
                                                        <span>
                                                            {(
                                                                product.productPrice *
                                                                productInCart.get(
                                                                    product.id
                                                                )
                                                            ).toLocaleString(
                                                                'ko-KR'
                                                            )}{' '}
                                                            원
                                                        </span>
                                                    </h5>
                                                    <button
                                                        className="btn btn-warning mb-2"
                                                        onClick={() =>
                                                            deleteFromCart(
                                                                product.id
                                                            )
                                                        }
                                                    >
                                                        <FontAwesomeIcon
                                                            className="mr-2"
                                                            icon={faMinusSquare}
                                                        />{' '}
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div className="row">
                                <div className="col-9">
                                    <p className="h5 text-right">
                                        합계:{' '}
                                        <span>
                                            {totalPrice.toLocaleString('ko-KR')}{' '}
                                            원
                                        </span>
                                    </p>
                                </div>
                                <div className="col-3">
                                    <div className="form-row">
                                        <Link to={'/order'}>
                                            <button className="btn btn-success">
                                                <FontAwesomeIcon
                                                    className="mr-2"
                                                    icon={faShoppingBag}
                                                />{' '}
                                                주문하기
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;
