import type { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect } from "react";
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

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { useRouter } from "next/router";

config.autoAddCss = false;

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const persistor = persistStore(store);

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  useEffect(() => {
    const updatePosition = (url: string): void => {
      const body_h = document.body.scrollHeight;
      let footer = document.getElementById("footer");
      let blank = document.getElementById("blank");

      try {
        const head = document.getElementById("common-header");
        const head_h = head?.clientHeight;
        const nav = document.getElementById("navbar-main");
        const nav_h = nav?.clientHeight;
        const mid = document.getElementById("mid");
        const mid_h = mid?.clientHeight;
        if (head_h && nav_h && mid_h) {
          const sum = head_h + nav_h + mid_h;

          if (footer && blank) {
            if (body_h < sum + 300) {
              footer.style.top = sum + "px";
              blank.style.height = 0 + "px";
            } else {
              footer.style.top = body_h - 300 + "px";
              blank.style.height = body_h - sum + "px";
              if (mid.className == "home") {
                blank.style.backgroundColor = "black";
                blank.className = "d-flex";
              } else {
                blank.style.backgroundColor = "inherit";
                blank.className = "hide";
              }
            }
          }
        }
      } catch {
        if (footer) {
          footer.style.top = body_h + "px";
        }
      }
    };

    router.events.on("routeChangeComplete", updatePosition);
    router.events.on("hashChangeComplete", updatePosition);
  }, []);

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
