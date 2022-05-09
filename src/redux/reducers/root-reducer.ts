import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import session from 'redux-persist/lib/storage/session';

import productReducer from './product-reducer';

import authReducer from './auth-reducer';
import cartReducer from './cart-reducer';
import adminReducer from './admin-reducer';
import orderReducer from './order-reducer';
import customerReducer from './customer-reducer';

const persistConfig = {
  key: 'root',
  storage: session,
  whitelist: ['order'],
};

const rootReducer = combineReducers({
  product: productReducer,
  auth: authReducer,
  cart: cartReducer,
  admin: adminReducer,
  order: orderReducer,
  customer: customerReducer,
});

type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;

export default persistReducer(persistConfig, rootReducer);
