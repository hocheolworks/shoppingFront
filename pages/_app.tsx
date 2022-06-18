import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import NavBar from "../src/component/NavBar/NavBar";
import Footer from "../src/component/Footer/Footer";
import store from "../src/store";
import Head from "next/head";
import "bootstrap/dist/css/bootstrap.css";
import "../styles/index.css";
// import '../styles/ProductCardsSlider.css';
// import '../styles/SliderBrands.css';
import "../styles/home.css";
import "../styles/MenuStyle.css";
import "../styles/Spinner.css";
import "../styles/Account.css";
import "../styles/admin.css";
import "../styles/ProductReview.css";
import "../styles/Login.css";

//test
import "../src/component/Switch/Switch.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const persistor = persistStore(store);

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>진솔유통</title>
        <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1"
        />
        <script src="https://code.jquery.com/jquery-latest.min.js"></script>
        <link
          rel="stylesheet"
          href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
        />
        <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.1.0/css/all.css"
        />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {() => (
            <>
              <NavBar />
              {getLayout(<Component {...pageProps} />)}
              <Footer />
            </>
          )}
        </PersistGate>
      </Provider>
    </>
  );
}
