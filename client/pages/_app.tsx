import App, { AppContext, AppProps } from "next/app";
import "../styles/global.css";
import Head from "next/head";
import PageLayout from "@/src/components/layout";
import Header from "@/src/components/header";
import { Provider } from "react-redux";
import { store } from "../src/store/store";
import buildClient from "@/api/build-client";

const MyApp = ({ Component, pageProps }: AppProps & { currentUser?: any }) => {
  return (
    <Provider store={store}>
      <Head>
        <title>Ticketing</title>
        <meta name="description" content="🧐" />
      </Head>
      <Header currentUser={pageProps.currentUser} />
      <PageLayout>
        <Component {...pageProps} currentUser={pageProps.currentUser} />
      </PageLayout>
    </Provider>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const client = buildClient(appContext.ctx);
  let currentUser = null;

  try {
    const { data } = await client.get("/api/users/currentuser");
    currentUser = data?.currentUser || null;
  } catch (err: any) {
    if (err.response?.status === 401) {
      // SSR redirect for unauthenticated users
      if (appContext.ctx.res) {
        appContext.ctx.res.writeHead(302, { Location: "/auth/signin" });
        appContext.ctx.res.end();
      } else {
        // fallback client-side redirect
        if (typeof window !== "undefined")
          window.location.href = "/auth/signin";
      }
    }
  }

  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      currentUser,
    },
  };
};

export default MyApp;
