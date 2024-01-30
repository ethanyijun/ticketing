import buildClient from "@/api/build-client";
import axios, { AxiosInstance } from "axios";
import React from "react";
import Link from "next/link";

export const Index = (props: any) => {
  return props.currentUser ? (
    <>
      <h1 className="mt-12">You are signed in</h1>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {props.tickets &&
            props.tickets.map((ticket: any, index: number) => (
              <tr key={index}>
                <td>
                  <Link href="/tickets/[ticketId]" as={`tickets/${ticket.id}`}>
                    {ticket.title}
                  </Link>
                </td>
                <td>{ticket.price}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  ) : (
    <h1 className="mt-12">You are not signed in</h1>
  );
};

export async function getServerSideProps(context: any) {
  const clientInstance = buildClient(context);
  // console.log("clientInstance:", clientInstance);

  clientInstance.interceptors.request.use(
    function (config) {
      // Log the URL before the request is sent
      console.log("Request config:", config);
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );
  const response = await axios.get(
    "http://www.ethangai.xyz/api/users/currentuser"
  );

  console.log("Received response from API:", response);
  // const response = await clientInstance.get("/api/users/currentuser");
  const { data } = await axios.get("http://www.ethangai.xyz/api/tickets");
  // await clientInstance.get("/api/tickets");
  return { props: { tickets: data, ...response.data } };
}

export default Index;
