import React, { useEffect } from 'react';
import GlobalStyles from '../styles/GlobalStyles';
import AppProviders from '../components/AppProviders';
import tw from 'twin.macro';
import 'typeface-dm-sans';
import '../../node_modules/quill/dist/quill.snow.css';
import '../styles/quill.css';

const MainContent = tw.div``;

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <AppProviders pageProps={pageProps}>
      <GlobalStyles />
      <MainContent>
        <Component {...pageProps} />
      </MainContent>
    </AppProviders>
  );
}

export default MyApp;
