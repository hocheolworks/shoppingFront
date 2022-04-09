import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import qs from 'qs';

import { AppStateType } from '../../../redux/reducers/root-reducer';
import { Order } from '../../../types/types';
import { useLocation } from 'react-router-dom';

const OrderFail: FC = () => {
    const location = useLocation();

    useEffect(() => {
        const query = qs.parse(location.search, { ignoreQueryPrefix: true });
        console.log(query);
    }, []);

    return (
        <div className="container text-center mt-5">
            <h2>주문에 실패하였습니다.</h2>
            <p>다시 시도해주세요.</p>
        </div>
    );
};

export default OrderFail;
