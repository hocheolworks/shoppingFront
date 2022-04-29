import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import NavBar from '../src/component/NavBar/NavBar';
import Footer from '../src/component/Footer/Footer';
import store from '../src/store';
import Head from 'next/head';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/NavBar.css';
import '../styles/Footer.css';
import '../styles/index.css';
import '../styles/ProductCardsSlider.css';
import '../styles/SliderBrands.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script src="https://developers.kakao.com/sdk/js/kakao.js"></script>
        <script>Kakao.init('40f4470f980d6e35252349d5045c0700');</script>
        <meta charSet="utf-8" />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1" /> */}
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
        <NavBar />
        <Component {...pageProps} />
        <Footer />
      </Provider>
    </>
  );
}
