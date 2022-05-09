import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import App from "./pages/App/App";
import store from "./store";
import { API_BASE_URL } from "./utils/constants/url";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  uri: API_BASE_URL,
  cache: new InMemoryCache(),
});

const persistor = persistStore(store);

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <App></App>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </ApolloProvider>,
  document.getElementById("root")
);
