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

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    <>
      <Head>
        <title>Ticketing</title>
        <meta name="description" content="🧐" />
      </Head>
      <Header currentUser={pageProps.currentUser}></Header>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
    </>
  );
};
MyApp.getInitialProps = async (
  context: AppContext
): Promise<AppInitialProps> => {
  const response = await axios
    .get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: context.ctx.req?.headers,
      }
    )
    .catch((error) => {});

  return { pageProps: { ...response?.data } };
};

export default MyApp;
