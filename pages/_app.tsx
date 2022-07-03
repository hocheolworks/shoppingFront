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
import "../styles/policy.css";

//test
import "../src/component/Switch/Switch.css";

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
        // debugger;
        if (head_h && nav_h && mid_h) {
          const sum = head_h + nav_h + mid_h;

          if (footer && blank) {
            const footer_h = footer.clientHeight;
            const blank_h = blank.clientHeight;

            if (body_h <= sum + footer_h) {
              footer.style.top = sum + (body_h - sum - footer_h) + "px";
              blank.style.height = body_h - sum - footer_h + "px";
            } else {
              footer.style.top = body_h - footer_h + "px";
              blank.style.height = body_h - sum - footer_h - blank_h + "px";

              if (mid.className == "home") {
                blank.style.backgroundColor = "black";
                blank.className = "d-flex";
              } else {
                blank.style.backgroundColor = "inherit";
                blank.className = "d-flex";
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
    // router.events.on("hashChangeComplete", updatePosition);
  }, []);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <>
      <Head>
        <title>전국 마트 타포린 가방 및 사은품 행사 전문점 | 진솔유통</title>
        <meta
          name="keyword"
          content="타포린, 마트 가방, 사은품, 인쇄 가능, 타포린 가방, 최저가"
        ></meta>{" "}
        <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, height=device-height, initial-scale=1"
        />
        <script src="https://code.jquery.com/jquery-latest.min.js"></script>
        <meta
          name="google-site-verification"
          content="44mhRtxhzzTjCdlitNGI0hvaXv8rciHua6VHysupZ4g"
        />
        <meta
          name="naver-site-verification"
          content="79af27b7b5ccbb5d3fa948ae38d21495799b5e91"
        />
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
        <link rel="shortcut icon" href="/image/favi/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/image/favi/apple-icon-57x57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/image/favi/apple-icon-60x60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/image/favi/apple-icon-72x72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/image/favi/apple-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/image/favi/apple-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/image/favi/apple-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/image/favi/apple-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/image/favi/apple-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/image/favi/apple-icon-180x180.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="192x192"
          href="/image/favi/android-icon-192x192.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/image/favi/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="96x96"
          href="/image/favi/favicon-96x96.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/image/favi/favicon-16x16.png"
        />
        <link rel="manifest" href="/image/favi/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta
          name="msapplication-TileImage"
          content="/image/favi/ms-icon-144x144.png"
        />
        <meta name="theme-color" content="#ffffff" />
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
