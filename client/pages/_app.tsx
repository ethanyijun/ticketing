import { type AppProps, type AppType } from "next/app";
import "../styles/global.css";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    <>
      <Head>
        <title>Chirp</title>
        <meta name="description" content="🧐" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
