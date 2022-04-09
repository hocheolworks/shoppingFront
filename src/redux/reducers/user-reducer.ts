import {
    AuthErrors,
    Customer,
    ReviewError,
    User,
    UserEditErrors,
} from '../../types/types';
import { LOGOUT_SUCCESS } from '../action-types/auth-action-types';
import {
    FETCH_USER_SUCCESS,
    USER_ADDED_REVIEW_FAILURE,
    USER_ADDED_REVIEW_SUCCESS,
    USER_UPDATED_FAILURE,
    USER_UPDATED_PASSWORD_FAILURE,
    USER_UPDATED_PASSWORD_SUCCESS,
    USER_UPDATED_SUCCESS,
    RESET_INPUT_FORM,
    FETCH_USER_BY_QUERY_SUCCESS,
    LOADING_USER_INFO,
    UserActionsTypes,
} from '../action-types/user-actions-types';

export type InitialStateType = {
    user: Partial<User>;
    customer: Partial<Customer>;
    isLoggedIn: boolean;
    isLoaded: boolean;
    successMessage: string;
    userEditErrors: Partial<UserEditErrors>;
    userResetPasswordErrors: Partial<AuthErrors>;
    reviewErrors: Partial<ReviewError>;
    isReviewAdded: boolean;
};

// origin code
// const initialState: InitialStateType = {
//     user: {},
//     isLoggedIn: false,
//     isLoaded: false,
//     successMessage: '',
//     userEditErrors: {},
//     userResetPasswordErrors: {},
//     reviewErrors: {},
//     isReviewAdded: false,
// };

// hard coding
// TODO: 나중에 지울것
const initialState: InitialStateType = {
    user: { id: 16, lastName: '이정철' },
    customer: { 
        id: 7,
        customerEmail: 'jahanda@naver.com', 
        customerName: '김형욱', 
        customerPassword:'123123', 
        customerPhoneNumber: '01098651070',
        customerPostIndex: '13493',
        customerAddress: '경기 성남시 분당구 판교로 338',
        customerAddressDetail: '3층 에스트래픽',
        userRole:'USER',
    },
    isLoggedIn: true,
    isLoaded: false,
    successMessage: '',
    userEditErrors: {},
    userResetPasswordErrors: {},
    reviewErrors: {},
    isReviewAdded: false,
};

const reducer = (
    state: InitialStateType = initialState,
    action: UserActionsTypes
): InitialStateType => {
    switch (action.type) {
        case LOADING_USER_INFO:
            // return { ...state, isLoaded: true };
            return { ...state, isLoaded: false }; // hard coding

        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isLoggedIn: true,
                isLoaded: false,
            };

        case USER_UPDATED_SUCCESS:
            return { ...state, user: action.payload, userEditErrors: {} };

        case USER_UPDATED_FAILURE:
            return { ...state, userEditErrors: action.payload };

        case USER_UPDATED_PASSWORD_SUCCESS:
            return {
                ...state,
                successMessage: action.payload,
                userResetPasswordErrors: {},
            };

        case USER_UPDATED_PASSWORD_FAILURE:
            return { ...state, userResetPasswordErrors: action.payload };

        case USER_ADDED_REVIEW_SUCCESS:
            return { ...state, reviewErrors: {}, isReviewAdded: true };

        case USER_ADDED_REVIEW_FAILURE:
            return {
                ...state,
                reviewErrors: action.payload,
                isReviewAdded: false,
            };

        case RESET_INPUT_FORM:
            return {
                ...state,
                userResetPasswordErrors: {},
                successMessage: '',
                userEditErrors: {},
                reviewErrors: {},
            };

        case LOGOUT_SUCCESS:
            return { ...state, user: {}, isLoggedIn: false };

        case FETCH_USER_BY_QUERY_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isLoggedIn: true,
                isLoaded: false,
            };

        default:
            return state;
    }
};

export default reducer;
