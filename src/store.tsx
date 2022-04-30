import {createStore, applyMiddleware, compose} from "redux";
import thunk from "redux-thunk";
import rootReducer from "./redux/reducers/root-reducer";
import promiseMiddleware from 'redux-promise';
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// const store = createStore(rootReducer, applyMiddleware(thunk));
const persistConfig = {
  key: 'root',
  storage
};

const persisted = persistReducer(persistConfig, rootReducer);

const store = createStore(persisted, compose(
  applyMiddleware(promiseMiddleware, thunk)
));

export default store;
