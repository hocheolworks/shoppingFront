import React from 'react';
import { useSelector } from 'react-redux';

import { User } from '../../types/types';
import { AppStateType } from '../../redux/reducers/root-reducer';
import Spinner from '../../component/Spinner/Spinner';

const AccountItem = () => {
    const usersData: Partial<User> = useSelector(
        (state: AppStateType) => state.user.user
    );
    const loading: boolean = useSelector(
        (state: AppStateType) => state.user.isLoaded
    );

    console.log(loading);

    return (
        <>
            {loading ? (
                <Spinner />
            ) : (
                <h4 style={{ display: 'flex', justifyContent: 'center' }}>
                    Hello!
                </h4>
            )}
        </>
    );
};

export default AccountItem;
