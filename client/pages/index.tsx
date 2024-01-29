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
  const { headers } = context.req;
  console.log("clientInstance: ", clientInstance);
  console.log("headers: ", headers);

  // Make a POST request to the API passing the context headers
  const response = await axios.post(
    "http://www.ethangai.xyz/api/users/currentuser",
    {
      // Add any request body data if needed
    },
    {
      headers: {
        ...headers,
        // Add any additional headers if needed
      },
    }
  );
  // const response = await clientInstance.get("/api/users/currentuser");
  const { data } = await clientInstance.get("/api/tickets");
  return { props: { tickets: data, ...response.data } };
}

export default Index;
