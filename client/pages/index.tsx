import axios from "axios";
import React from "react";

export const Index = ({ currentUser }: any) => {
  return currentUser ? (
    <h1 className="mt-12">You are signed in</h1>
  ) : (
    <h1 className="mt-12">You are not signed in</h1>
  );
};

export async function getServerSideProps(context: any) {
  const response = await axios
    .get(
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: context.req.headers,
      }
    )
    .catch((error) => {});
  return { props: { ...response?.data } };
}

export default Index;
