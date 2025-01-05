import App, {
  AppContext,
  AppInitialProps,
  type AppProps,
  type AppType,
} from "next/app";
import "../styles/global.css";
import Head from "next/head";
import PageLayout from "@/src/components/layout";
import axios from "axios";
import Header from "@/src/components/header";
import { Provider } from "react-redux";
import { store } from "../src/store/store";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <Head>
        <title>Ticketing</title>
        <meta name="description" content="🧐" />
      </Head>
      <Header currentUser={pageProps.currentUser}></Header>
      <PageLayout>
        <Component currentUser={pageProps.currentUser} {...pageProps} />
      </PageLayout>
    </Provider>
  );
};

export default MyApp;
