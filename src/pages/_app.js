import Theme from '../styles/theme';
import Head from 'next/head'
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head >
      <title>Welcome to my World</title>
      </Head>
      <Theme>
        <Component {...pageProps} />
      </Theme>
    </>
  );
}
 