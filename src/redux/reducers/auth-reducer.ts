import { AuthErrors, Customer } from "../../types/types";
import { FORM_RESET } from "../action-types/admin-action-types";
import {
  ACTIVATE_ACCOUNT_FAILURE,
  ACTIVATE_ACCOUNT_SUCCESS,
  FORGOT_PASSWORD_FAILURE,
  FORGOT_PASSWORD_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_SUCCESS,
  LOGOUT_SUCCESS,
  REGISTER_FAILURE,
  REGISTER_SUCCESS,
  RESET_PASSWORD_CODE_FAILURE,
  RESET_PASSWORD_CODE_SUCCESS,
  RESET_PASSWORD_FAILURE,
  RESET_PASSWORD_SUCCESS,
  SHOW_LOADER,
  AuthActionTypes,
} from "../action-types/auth-action-types";

export type InitialStateType = {
  customer: Partial<Customer>;
  customerEmail: string | null;
  customerRole: string | null;
  isRegistered: boolean;
  loading: boolean;
  success: string;
  error: string;
  errors: Partial<AuthErrors>;
};

const initialState: InitialStateType = {
  customer: {},
  customerEmail: "",
  customerRole: "",
  isRegistered: false,
  loading: false,
  success: "",
  error: "",
  errors: {},
};

const reducer = (
  state: InitialStateType = initialState,
  action: AuthActionTypes
): InitialStateType => {
  switch (action.type) {
    case SHOW_LOADER:
      return { ...state, loading: true, errors: {} };

    case LOGIN_SUCCESS:
      return { ...state, customerRole: action.payload };

    case LOGIN_FAILURE:
      return { ...state, error: action.payload };

    case REGISTER_SUCCESS:
      return { ...state, isRegistered: true, loading: false, errors: {} };

    case REGISTER_FAILURE:
      return { ...state, errors: action.payload, loading: false };

    case ACTIVATE_ACCOUNT_SUCCESS:
      return { ...state, success: action.payload };

    case ACTIVATE_ACCOUNT_FAILURE:
      return { ...state, error: action.payload };

    case FORGOT_PASSWORD_SUCCESS:
      return {
        ...state,
        success: action.payload,
        loading: false,
        errors: {},
        error: "",
      };

    case FORGOT_PASSWORD_FAILURE:
      return { ...state, error: action.payload, loading: false };

    case RESET_PASSWORD_CODE_SUCCESS:
      return { ...state, customer: action.payload };

    case RESET_PASSWORD_CODE_FAILURE:
      return { ...state, error: action.payload };

    case RESET_PASSWORD_SUCCESS:
      return { ...state, success: action.payload };

    case RESET_PASSWORD_FAILURE:
      return { ...state, errors: action.payload };

    case LOGOUT_SUCCESS:
      return { ...state, customerRole: "" };

    case FORM_RESET:
      return {
        ...state,
        error: "",
        errors: {},
        success: "",
        isRegistered: false,
        loading: false,
      };

    default:
      return state;
  }
};

export default reducer;
